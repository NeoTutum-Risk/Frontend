import os
import json
import seaborn as sn
import matplotlib.pyplot as plt
from matplotlib.ticker import MaxNLocator
from matplotlib.colors import LinearSegmentedColormap
from pydantic import BaseModel, Field
from typing import Optional
import operator
import numpy as np
from itertools import groupby
# from IPython.display import HTML, display
from string import ascii_uppercase as au
from datetime import datetime
import requests
import io
import pandas as pd


# Factory method to handle operators
def operate(inp, relate, cut):
    ops = {'>': operator.gt,
           '<': operator.lt,
           '>=': operator.ge,
           '<=': operator.le,
           '==': operator.eq}
    return ops[relate](inp, cut)


# Validate and extract metadata
class MetaDataModel(BaseModel):
    name: str
    created: str
    entityName: str = None
    level: int
    serviceChainId: int
    serviceChainName: str
    riskAssessmentId: int
    status: str
    bpmnDataObjectId: str = None
    description: Optional[str]
    statement: str = None
    impact: str = None
    riskFailureMode: str = None
    causeFailureMechanism: str = None
    groupStatus: str
    Type: str
    groupId: Optional[int]
    groupName: Optional[str]
    groupRiskAssessment: Optional[str]


class RiskConnectionModel(BaseModel):
    parent: int = Field(alias='sourceRef')
    child: int = Field(alias='targetRef')


def draw_stacked_chart(**kwargs):
    dic = {}
    for i, entity in enumerate(kwargs['entities']):
        dic[au[i]] = entity
    labels = list(dic.keys())
    ind = np.arange(len(labels))
    fig, ax = plt.subplots()
    width = 0.40
    title = kwargs['title']
    level_one = np.array(kwargs['level_one'])
    level_two = np.array(kwargs['level_two'])
    level_three = np.array(kwargs['level_three'])
    level_four = np.array(kwargs['level_four'])
    level_five = np.array(kwargs['level_five'])
    '''To Be Changed once we have reference group'''
    ax.bar(ind, level_one, width, label='level one', color=kwargs['colors'][0])
    ax.bar(ind, level_two, width, bottom=level_one, label='level two',
           color=kwargs['colors'][1])
    ax.bar(ind, level_three, width, bottom=level_one + level_two,
           label='leve three',
           color=kwargs['colors'][2])
    ax.bar(ind, level_four, width, bottom=level_one + level_two + level_three,
           label='level four', color=kwargs['colors'][3])
    ax.bar(ind, level_five, width,
           bottom=level_one + level_two + level_three + level_four, label='level five',
           color=kwargs['colors'][4])
    ax.set_ylabel(kwargs['y_label'])
    str_text = '\n'.join([x[0] + ' : ' + x[1] for x in dic.items()])
    ax.text(1, kwargs['max_value'] + 2, str_text, ha="left")
    plt.ylim(top=kwargs['max_value'] + 4)
    plt.xticks(fontsize=8)
    ax.set_title(title)
    fig.set_figwidth(10)
    ax.xaxis.set_major_locator(MaxNLocator(integer=True))
    ax.legend()
    index = 0
    levels_data = [x for x in [kwargs['level_one'], kwargs['level_two'], kwargs['level_three'], kwargs['level_four'],
                               kwargs['level_five']]]
    heights = [sum(i) for i in zip(*levels_data)]
    for bar, label in zip(ax.patches, labels):
        height = heights[index]
        ax.text(
            bar.get_x() + bar.get_width() / 2, height, label, ha="center")
        index += 1
    if kwargs['riskID_mode']:
        stamp_risk_objects_ids(ax, kwargs['mapping'], labels=kwargs['entities'])
    # property_name = kwargs['property_name']
    svg_chart = io.BytesIO()
    plt.savefig(svg_chart, format="svg")
    png_chart = io.BytesIO()
    plt.savefig(png_chart, format="png")
    chart_data = {'title': title, 'chart_type': 'stacked bar chart', 'svg_chart': svg_chart.getvalue().decode(),
                  'creation_date': datetime.now()}
    # plt.savefig(os.path.join(kwargs['output_directory'], f'{title}_{property_name}.svg'))
    # plt.show()
    plt.clf()
    plt.close(fig)
    return chart_data


def stamp_risk_objects_ids(ax, mapping, labels):
    for container in ax.containers:
        if max([x.get_height() for x in container]) > 0:
            for rec in container:
                if rec.get_height() > 0:
                    entity = labels[container.index(rec)]
                    related_ids = [risk[0] for risk in mapping.items() if
                                   risk[1]['name'] == entity and max(risk[1]['scores']) > 0]
                    offset = 0.5
                    for risk_id in related_ids:
                        ax.text(rec.get_x() + rec.get_width() / 2,
                                offset,
                                f'id: {risk_id}',
                                ha='center',
                                color='black',
                                weight='bold',
                                size=6
                                )
                        offset += 1


def draw_heat_map(**kwargs):
    x_data = kwargs['x_labels']
    y_data = kwargs['y_labels']
    title = kwargs['title']
    # data_matrix.reverse()
    values = np.array(kwargs['data_matrix'])
    colors = kwargs['colors']
    cmap_name = 'my_list'
    cm = LinearSegmentedColormap.from_list(cmap_name, colors, N=5)
    fig, ax = plt.subplots()
    im = ax.imshow(values, cmap=cm)

    ax.set_xticks(np.arange(len(x_data)), labels=x_data)
    ax.set_yticks(np.arange(len(y_data)), labels=y_data)

    plt.setp(ax.get_xticklabels(), ha="right", rotation=45,
             rotation_mode="anchor")

    # Loop over data dimensions and create text annotations.
    positions = [item['position'] for item in kwargs['risk_positions']]
    for i in range(len(x_data)):
        for j in range(len(y_data)):
            if (str(j), str(i)) in positions:
                ids = '\n'.join(
                    [str(item['id']) for item in kwargs['risk_positions'] if (str(j), str(i)) == item['position']])
                ax.text(j, i, ids,
                        ha="center", va="center", color="black", size=8)

    ax.set_title(title)
    fig.tight_layout()
    # property_name = kwargs['property_name']
    # plt.savefig(os.path.join(kwargs['output_directory'], f'heat map_{property_name}.svg'))
    svg_chart = io.BytesIO()
    plt.savefig(svg_chart, format="svg")
    png_chart = io.BytesIO()
    plt.savefig(png_chart, format="png")
    chart_data = {'title': title, 'chart_type': 'heatmap', 'svg_chart': svg_chart.getvalue().decode(),
                  'creation_date': datetime.now().strftime("%m/%d/%Y, %H:%M:%S")}
    # plt.show()
    plt.clf()
    plt.close(fig)
    return chart_data


def draw_pdf_chart(**kwargs):
    title = kwargs['title']
    data_object_id = kwargs['data_object_id']
    sn.kdeplot(data=kwargs['result_data'], color='green', fill=True).set(title=title)
    plt.savefig(os.path.join(kwargs['output_directory'], f'{data_object_id}_{title}.svg'))
    # plt.show()


def draw_analytic_pdf_chart(**kwargs):
    title = kwargs['title']
    labels = kwargs['data_labels']
    data = kwargs['result_data']
    data_object_id = kwargs['data_object_id']

    fig, ax = plt.subplots()
    df = pd.DataFrame({
        'x_axis': labels,
        'y_axis': data
    })
    # plt.xlim(top=max(labels))
    plt.ylim(top=max(data))
    plt.title(title)
    plt.plot('x_axis', 'y_axis', data=df, linestyle='-', marker='.')
    svg_chart = io.BytesIO()
    plt.savefig(svg_chart, format="svg")
    chart_data = {'data_object_id': data_object_id, 'title': title, 'chart_type': 'bar chart',
                  'svg_chart': svg_chart.getvalue().decode()}
    plt.clf()
    plt.close(fig)
    return chart_data


def draw_analytic_bar_chart(**kwargs):
    title = kwargs['title']
    labels = kwargs['data_labels']
    data = kwargs['result_data']
    data_object_id = kwargs['data_object_id']

    # draw bar chart
    fig, ax = plt.subplots()
    plt.setp(ax.get_xticklabels(), ha="right", rotation=45,
             rotation_mode="anchor")
    width = 0.50
    '''To Be Changed once we have reference group'''
    plt.barh(labels, data, width, color=kwargs['colors'])
    # ax.invert_yaxis()  # labels read top-to-bottom
    plt.title(title)
    plt.xlim(0, max(data) + 0.5)
    plt.tick_params(
        axis='x',  # changes apply to the x-axis
        which='both',  # both major and minor ticks are affected
        bottom=False,  # ticks along the bottom edge are off
        top=False,  # ticks along the top edge are off
        labelbottom=False)  # labels along the bottom edge are off
    wanted = [bar for bar in ax.patches if bar.get_width() > 0]
    for bar in wanted:
        value = bar.get_width() * 100
        ax.text(bar.get_width(), bar.get_y() + bar.get_height() / 2, str('%.2f' % value) + '%', color='black',
                ha='left', va='center')
    # plt.show()
    # figure = plt.gcf()
    # figure.set_size_inches(20, 14)
    svg_chart = io.BytesIO()
    plt.savefig(svg_chart, format="svg")
    chart_data = {'data_object_id': data_object_id, 'title': title, 'chart_type': 'bar chart',
                  'svg_chart': svg_chart.getvalue().decode()}
    # plt.show()
    plt.clf()
    plt.close(fig)
    return chart_data


# Risk Analysis main class
class NeoTutum:
    risk_assessment = {}
    risk_objects = {}
    meta_data = {}
    risk_objects_properties = {}
    reference_data = {}
    riskObjectTypes = []

    def __init__(self, ra_id):
        self.__risk_assessment_id = ra_id
        self.__creation_date = datetime.now()
        print(self.__creation_date)
        self.__output_risk_data = os.path.join(os.getcwd(), ra_id, self.__creation_date.strftime('%Y-%m-%d_%H-%M'))
        # if not os.path.exists(self.__output_risk_data):
        #     os.makedirs(self.__output_risk_data)
        self.__output_data_object = ''
        self.__json_object = self.__load_risk_assessment_data(ra_id)
        NeoTutum.risk_assessment = self.__json_object
        NeoTutum.risk_objects = NeoTutum.risk_assessment['riskObjects']
        NeoTutum.riskObjectTypes = NeoTutum.risk_assessment['configJSON']['riskObjectTypes']
        NeoTutum.meta_data = self.__extract_meta()
        NeoTutum.risk_objects_properties = self.__extract_properties()
        self.__risk_connections = self.__extract_risk_connections()
        self.__dataObjects = []
        self.__dataObjects_connections = []
        self.__model_dataset = {}
        self.__connection_tree = {}
        self.__implied_values = {}
        self.__analysis_packs = []
        NeoTutum.reference_data = NeoTutum.risk_assessment['referenceData']
        self.__lookUpData = self.__extract_lookUpData()
        self.__analytics_charts_details = []
        # self.__load_output_json()
        self.__Colors = self.__extract_colors()
        self.__colors_mapper = {str(i + 1): v for i, v in enumerate(self.__Colors)}
        self.__colors_mapper['0'] = '#FFFFFF'
        self.__errors_log = []

    @staticmethod
    def __load_risk_assessment_data(ra_id):
        """Load risk assessment as and return json object"""
        url = 'https://stage-service-dot-neotutum.nw.r.appspot.com/JSONAnalytics/RA-Analytics-IO/' + ra_id
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
        data = requests.get(url, headers=headers, verify=True)
        return json.loads(data.text)

    @staticmethod
    def __extract_lookUpData():
        lookUpData = NeoTutum.risk_assessment['lookUpData']
        ref_data = {}
        for ref in lookUpData:
            key = ref['metaDataLevel2Name']
            ref_data[key] = []
            for index, value in enumerate(ref['values']):
                ref_record = {'item': {}}
                ref_record['item']['x'] = ref['x']['xDataPoints'][index]
                ref_record['item']['y'] = ref['y']['yDataPoints'][index]
                ref_record['item']['value'] = value
                ref_record['item']['probability'] = ref['probabilities'][index]
                ref_record['item']['color'] = ref['color'][index]
                ref_record['item']['level'] = ref['level'][index]
                ref_record['item']['type'] = ref['Type'][index]
                ref_record['item']['scalar'] = ref['Scalar'][index]
                ref_data[key].append(ref_record)
        return ref_data

    def __extract_meta(self):
        """extract all required metadata from each RiskObject item"""
        meta = {}
        for risk_object in self.__json_object['riskObjects']:
            meta_data = MetaDataModel(**risk_object)
            meta[risk_object['id']] = meta_data.dict()
        return meta

    def __extract_properties(self):
        """extract all properties details from each RiskObject item"""
        properties = {}
        for risk_object in self.__json_object['riskObjects']:
            properties[risk_object['id']] = risk_object['properties']
        return properties

    @staticmethod
    def __extract_colors():
        color_items = \
            [item['refDataObjects'] for item in NeoTutum.reference_data if item['metaDataLevel2Name'] == 'PoC'][0]
        colors = []
        for item in color_items:
            colors.append(item['color'])
        return colors

    def __extract_risk_connections(self):
        """extract all risk connections"""
        risk_connections = {'links': []}
        for connection in self.__json_object['riskConnections']:
            link = RiskConnectionModel(**connection)
            parent_type = self.meta_data[link.dict()['parent']]['Type']
            child_type = self.meta_data[link.dict()['child']]['Type']
            link_data = link.dict()
            link_data['parent_type'] = parent_type
            link_data['child_type'] = child_type
            risk_connections['links'].append(link_data)
        return risk_connections

    def __extract_dataObjects(self):
        self.__dataObjects = self.__json_object['dataObjects']

    def __extract_dataObjects_connections(self):
        self.__dataObjects_connections = self.__json_object['dataObjectsRiskObjectsConnections']

    def draw_risk_object_count(self, title='Risk Object count', riskID_mode=False, show=False):
        """draw risk objects count"""
        risk_mapping = {}
        labels = NeoTutum.riskObjectTypes
        available_types = [item['Type'] for item in self.meta_data.values()]
        types_count = {i: available_types.count(i) for i in available_types}
        for item in self.meta_data.items():
            risk_object_id = item[0]
            record_details = {'name': item[1]['Type'], 'scores': [1]}
            risk_mapping[risk_object_id] = record_details
        # draw bar chart
        fig, ax = plt.subplots()
        width = 0.50
        plt.bar(labels, [item for item in types_count.values()],
                width, color=['blue', 'red', 'green'])
        plt.xlabel('Risk Object Type')
        plt.ylabel('Number of risk objects of each type')
        plt.ylim(top=max([item for item in types_count.values()]) + 1)
        plt.title(title)
        if riskID_mode:
            stamp_risk_objects_ids(ax, risk_mapping, labels)
        # plt.savefig(os.path.join(self.__output_risk_data, 'risk_object_count.svg'))
        svg_chart = io.BytesIO()
        plt.savefig(svg_chart, format="svg")
        png_chart = io.BytesIO()
        plt.savefig(png_chart, format="png")
        if show:
            plt.show()
        else:
            chart_data = {'title': title, 'chart_type': 'bar chart', 'svg_chart': svg_chart.getvalue().decode(),
                          'creation_date': self.__creation_date.strftime("%m/%d/%Y, %H:%M:%S")}
            # self.__analytics_charts_details.append(chart_data)
            # print(self.__save_analytics_charts(title=title, chart_type='bar chart', svg_chart=svg_chart.getvalue()))
            plt.clf()
            plt.close(fig)
            return chart_data

    # def draw_risk_object_count_with_filter_all(self, property_name=None, level=None, op=None):
    #     physical_ids = [value[0] for value in self.meta_data.items() if value[1]['Type']
    #                     == 'physical']
    #     virtual_ids = [value[0] for value in self.meta_data.items() if value[1]['Type']
    #                    == 'virtual']
    #     model_ids = [value[0] for value in self.meta_data.items() if value[1]['Type']
    #                  == 'model']
    #
    #     ph_count = 0
    #     vir_count = 0
    #     mod_count = 0
    #     for risk_object_id in self.__properties:
    #         if risk_object_id in physical_ids:
    #             for prop in self.__properties[risk_object_id]:
    #                 if prop['metaDataLevel2_name'] == property_name and operate(int(prop[0]['Value']), op, level):
    #                     ph_count += 1
    #                     break
    #         elif risk_object_id in virtual_ids:
    #             for prop in self.__properties[risk_object_id]:
    #                 if prop['metaDataLevel2_name'] == property_name and operate(int(prop[0]['Value']), op, level):
    #                     vir_count += 1
    #                     break
    #
    #         elif risk_object_id in model_ids:
    #             for prop in self.__properties[risk_object_id]:
    #                 if prop['metaDataLevel2_name'] == property_name and operate(int(prop[0]['Value']), op, level):
    #                     mod_count += 1
    #                     break
    #
    #     # draw bar chart
    #     width = 0.50
    #     '''To Be Changed once we have reference group'''
    #     plt.bar(['Physical', 'Virtual', 'Model'], [ph_count, vir_count, mod_count],
    #             width, color=['blue', 'red', 'green'])
    #     plt.xlabel('Risk Object Type')
    #     plt.ylabel('Number of risk Objects')
    #     plt.ylim(top=max([ph_count, vir_count, mod_count]) + 1)
    #     plt.title('Risk Object count')
    #     plt.clf()
    #     # plt.show()

    def draw_risk_object_count_with_filter_types(self, risk_type=None, property_name=None, level=None, op=None):
        object_ids = [value[0] for value in self.meta_data.items() if value[1]['Type']
                      == risk_type]

        count = 0
        for risk_object_id in self.__properties:
            if risk_object_id in object_ids:
                for prop in self.__properties[risk_object_id]:
                    if prop['metaDataLevel2_name'] == property_name and operate(int(prop[0]['Value']), op, level):
                        count += 1
                        break

        # draw bar chart
        width = 0.50
        plt.bar([risk_type], [count],
                width, color=['blue'])
        plt.xlabel('Risk Object Type')
        plt.ylabel('Number of risk Objects')
        plt.title('Risk Object count')
        plt.ylim(top=6)

    def draw_risk_object_values(self, risk_type=None, property_name=None, title=None, riskID_mode=False):
        object_ids = [value[0] for value in self.meta_data.items() if value[1]['Type']
                      == risk_type] if risk_type else [value[0] for value in self.meta_data.items()]
        scores = {}
        risk_mapping = {}
        labels = ['level 1', 'level 2', 'level 3', 'level 4', 'level 5']
        properties = NeoTutum.risk_objects_properties
        for risk_object_id in properties:
            if risk_object_id in object_ids:
                for prop in properties[risk_object_id]:
                    value = prop['metaDataLevel1']['metaDataLevel2']['elements'][0]['Value']
                    if prop['metaDataLevel1']['metaDataLevel2']['name'] == property_name:
                        record_details = {'name': 'level ' + str(value),
                                          'scores': [int(value)]}
                        scores[risk_object_id] = int(value)
                        risk_mapping[risk_object_id] = record_details
                        break
        not_found = list(set(object_ids) - set(list(scores.keys())))
        if len(not_found) > 0:
            risk_type = 'All' if not risk_type else risk_type
            self.__errors_log.append(f'risk without {property_name} with type {risk_type}')
        # draw bar chart
        score_counts = [list(scores.values()).count(1), list(scores.values()).count(2),
                        list(scores.values()).count(3), list(scores.values()).count(4),
                        list(scores.values()).count(5)]

        fig, ax = plt.subplots()
        width = 0.50
        plt.bar(labels, score_counts,
                width, color=self.__Colors)
        plt.xlabel('Risk Score')
        plt.ylabel('Risk score count')
        plt.ylim(top=max(score_counts) + 1)
        plt.title(title)
        if riskID_mode:
            stamp_risk_objects_ids(ax, risk_mapping, labels)
        # plt.savefig(os.path.join(self.__output_risk_data, f'risk_object_count_{property_name}_{risk_type}.svg'))
        svg_chart = io.BytesIO()
        plt.savefig(svg_chart, format="svg")
        png_chart = io.BytesIO()
        plt.savefig(png_chart, format="png")
        chart_data = {'title': title, 'chart_type': 'bar chart', 'svg_chart': svg_chart.getvalue().decode(),
                      'creation_date': self.__creation_date}
        # self.__analytics_charts_details.append(chart_data)
        # plt.show()
        plt.clf()
        plt.close(fig)
        return chart_data

    def handle_risk_per_process(self, property_name, title=None, y_label=None, riskID_mode=False):
        try:
            entity_names = list(set([value[1]['entityName'] for value in self.meta_data.items() if value[1]['Type']
                                     == 'physical' and value[1]['entityName']]))
            level_one = []
            level_two = []
            level_three = []
            level_four = []
            level_five = []
            risk_mapping = {}
            for entity in entity_names:
                object_ids = [value[0] for value in self.meta_data.items() if value[1]['Type']
                              == 'physical' and value[1]['entityName'] == entity]
                levels = []
                for risk_object_id in object_ids:
                    record_details = {'name': entity, 'scores': 0, 'order': entity_names.index(entity) + 1}
                    properties = NeoTutum.risk_objects_properties[risk_object_id]
                    for prop in properties:
                        if prop['metaDataLevel1']['metaDataLevel2']['name'] == property_name:
                            if property_name == 'PoC' or property_name == 'PoD':
                                score_value = int(
                                    prop['metaDataLevel1']['metaDataLevel2']['elements'][0]['dataObjectElementId'][
                                        'label'].split('_')[1])
                            else:
                                score_value = int(prop['metaDataLevel1']['metaDataLevel2']['elements'][0]['Value'])
                            levels.append(score_value)
                            record_details['scores'] = [score_value]
                    risk_mapping[risk_object_id] = record_details
                level_one.append(levels.count(1))
                level_two.append(levels.count(2))
                level_three.append(levels.count(3))
                level_four.append(levels.count(4))
                level_five.append(levels.count(5))
            max_value = max([max(level_one), max(level_two), max(level_three), max(level_four),
                             max(level_five)])
            chart_data = draw_stacked_chart(entities=entity_names, colors=self.__Colors,
                                            output_directory=self.__output_risk_data,
                                            property_name=property_name,
                                            level_one=level_one, level_two=level_two,
                                            level_three=level_three, level_four=level_four,
                                            level_five=level_five, max_value=max_value, mapping=risk_mapping,
                                            title=title, y_label=y_label, riskID_mode=riskID_mode)
            # self.__analytics_charts_details.append(chart_data)
            return chart_data
        except Exception as ex:
            self.__errors_log.append(f'Error in risk process {ex}')

    def handle_risk_per_hierarchical_data(self, property_name, level=0, title=None, y_label=None, riskID_mode=False):
        try:
            groups = {}
            risk_mapping = {}
            properties = NeoTutum.risk_objects_properties
            for value in properties.items():
                record_details = {}
                for element in value[1]:
                    if element['metaDataLevel1']['metaDataLevel2']['name'].strip() == property_name:
                        category_name = \
                            element['metaDataLevel1']['metaDataLevel2']['elements'][level]['dataObjectElementId'][
                                'name']
                        record_details['name'] = category_name
                        if category_name in groups.keys():
                            total_risk_score = [int(
                                [item['metaDataLevel1']['metaDataLevel2']['elements'][0]['Value'] for item in value[1]
                                 if item['metaDataLevel1']['metaDataLevel2']['name'] == 'Total Risk'][
                                    0])]
                            score1_count = total_risk_score.count(1)
                            score2_count = total_risk_score.count(2)
                            score3_count = total_risk_score.count(3)
                            score4_count = total_risk_score.count(4)
                            score5_count = total_risk_score.count(5)
                            groups[category_name] = {'total_risk1': groups[category_name]['total_risk1'] + score1_count,
                                                     'total_risk2': groups[category_name]['total_risk2'] + score2_count,
                                                     'total_risk3': groups[category_name]['total_risk3'] + score3_count,
                                                     'total_risk4': groups[category_name]['total_risk4'] + score4_count,
                                                     'total_risk5': groups[category_name]['total_risk5'] + score5_count}
                        else:
                            groups[category_name] = {'total_risk1': 0, 'total_risk2': 0, 'total_risk3': 0,
                                                     'total_risk4': 0, 'total_risk5': 0}
                        record_details['scores'] = list(groups[category_name].values())
                if len(record_details.values()) > 0:
                    risk_mapping[value[0]] = record_details
            entity_names = list(groups.keys())
            level_one = [item['total_risk1'] for item in groups.values()]
            level_two = [item['total_risk2'] for item in groups.values()]
            level_three = [item['total_risk3'] for item in groups.values()]
            level_four = [item['total_risk4'] for item in groups.values()]
            level_five = [item['total_risk5'] for item in groups.values()]
            max_value = max([max(level_one), max(level_two), max(level_three), max(level_four),
                             max(level_five)])
            draw_stacked_chart(entities=entity_names, colors=self.__Colors,
                               output_directory=self.__output_risk_data,
                               property_name=property_name,
                               level_one=level_one, level_two=level_two,
                               level_three=level_three, level_four=level_four,
                               level_five=level_five, max_value=max_value, mapping=risk_mapping,
                               title=title, y_label=y_label, riskID_mode=riskID_mode)
        except Exception as ex:
            self.__errors_log.append(f'Error in hierarchical data {ex}')

    def draw_risk_object_connections_basic(self, risk_type=None, title=None, connection_type=None, riskID_mode=False):
        risk_mapping = {}
        if risk_type:
            object_ids = [value[0] for value in self.meta_data.items() if value[1]['Type']
                          == risk_type]
            connection_list = self.get_connection_list(risk_type=risk_type, connection_type=connection_type)
        else:
            object_ids = [value[0] for value in self.meta_data.items()]
            connection_list = self.get_connection_list(risk_type=risk_type, connection_type=connection_type)
        mapping = {i: connection_list.count(i) for i in object_ids}
        if len(mapping) > 0:
            labels = list(range(max(mapping.values()) + 3))
            # prepare risk_mapping for stamping ids
            for item in mapping.items():
                risk_mapping[item[0]] = {'name': str(item[1]), 'scores': [1]}
            # draw bar chart
            fig, ax = plt.subplots()
            width = 0.60
            '''To Be Changed once we have reference group'''
            values = [list(mapping.values()).count(i) for i in labels]
            labels = [str(x) for x in labels]
            plt.bar(labels, values, width)
            plt.xlabel('Number of connections')
            plt.ylabel('risk objects count')
            plt.ylim(top=max(values) + 1)
            plt.title(title)
            ax.xaxis.set_major_locator(MaxNLocator(integer=True))
            ax.yaxis.set_major_locator(MaxNLocator(integer=True))
            if riskID_mode:
                stamp_risk_objects_ids(ax, risk_mapping, labels)
            # plt.savefig(
            #     os.path.join(self.__output_risk_data, f'Number of connections_{connection_type}_{risk_type}.svg'))
            svg_chart = io.BytesIO()
            plt.savefig(svg_chart, format="svg")
            png_chart = io.BytesIO()
            plt.savefig(png_chart, format="png")
            chart_data = {'title': title, 'chart_type': 'bar chart', 'svg_chart': svg_chart.getvalue().decode(),
                          'creation_date': self.__creation_date}
            # self.__analytics_charts_details.append(chart_data)
            # plt.show()
            plt.clf()
            plt.close(fig)
            return chart_data
        else:
            self.__errors_log.append(f'No risk objects connections available')

    def handle_heat_map_data(self, property_name, title):
        try:
            reference_data = [float(item['item']['level']) for item in self.__lookUpData[property_name]]
            data_matrix = [reference_data[x:x + 5] for x in range(0, len(reference_data), 5)]
            # get PoC and PoD of each risk object position
            risk_positions = []
            properties = NeoTutum.risk_objects_properties
            for risk_properties in properties.items():
                if any(item['metaDataLevel1']['metaDataLevel2']['name'] == property_name for item in
                       risk_properties[1]):
                    risk_id = risk_properties[0]
                    x_pos = \
                        [item for item in risk_properties[1] if
                         item['metaDataLevel1']['metaDataLevel2']['name'] == 'PoC'][
                            0][
                            'metaDataLevel1']['metaDataLevel2']['elements'][0]['dataObjectElementId']['label'].split(
                            '_')[1]
                    y_pos = \
                        [item for item in risk_properties[1] if
                         item['metaDataLevel1']['metaDataLevel2']['name'] == 'PoD'][
                            0][
                            'metaDataLevel1']['metaDataLevel2']['elements'][0]['dataObjectElementId']['label'].split(
                            '_')[1]
                    risk_positions.append({'id': risk_id, 'position': (x_pos, y_pos)})
            x_labels_source = \
                [item for item in NeoTutum.risk_assessment['lookUpData'] if
                 item['metaDataLevel2Name'] == property_name][0][
                    'x']['xLookUpMetaData']['metaDataLevel2Name']
            x_labels = [name['name'] for name in [item for item in NeoTutum.risk_assessment['referenceData'] if
                                                  item['metaDataLevel2Name'] == x_labels_source][0]['refDataObjects']]
            y_labels_source = \
                [item for item in NeoTutum.risk_assessment['lookUpData'] if
                 item['metaDataLevel2Name'] == property_name][0][
                    'y']['yLookUpMetaData']['metaDataLevel2Name']
            y_labels = [name['name'] for name in [item for item in NeoTutum.risk_assessment['referenceData'] if
                                                  item['metaDataLevel2Name'] == y_labels_source][0]['refDataObjects']]
            chart_data = draw_heat_map(data_matrix=data_matrix, risk_positions=risk_positions,
                                       title=title, colors=self.__Colors,
                                       output_directory=self.__output_risk_data,
                                       x_labels=x_labels,
                                       y_labels=y_labels,
                                       property_name=property_name)
            # self.__analytics_charts_details.append(chart_data)
            return chart_data
        except Exception as ex:
            self.__errors_log.append(f'Error in heatmap {ex}')

    def get_connection_list(self, risk_type, connection_type):
        if risk_type:
            if connection_type:
                connection_list = [item[connection_type] for item in self.__risk_connections['links'] if
                                   item[f'{connection_type}_type'] == risk_type]
            else:
                connection_list = [item['parent'] for item in self.__risk_connections['links'] if
                                   item[f'parent_type'] == risk_type] + [item['child'] for item in
                                                                         self.__risk_connections['links'] if
                                                                         item[f'child_type'] == risk_type]
        else:
            if connection_type:
                connection_list = [item[connection_type] for item in self.__risk_connections['links']]
            else:
                connection_list = [item['parent'] for item in self.__risk_connections['links']] + [item['child'] for
                                                                                                   item
                                                                                                   in
                                                                                                   self.__risk_connections[
                                                                                                       'links']]
        return connection_list

    def create_appendix(self):
        html_content = ''
        for risk_object in self.meta_data.items():
            try:
                html_template = "<table style='width:100%; border: 1px solid black; margin-bottom:15px;'>" \
                                "<tr><td style='text-align:left; border: 1px solid black;'><b>Risk ID:</b> @risk_id@</td>" \
                                "<td style='text-align:left; border: 1px solid black;'><b>Date Created:</b> @created_date@</td>" \
                                "<td style='text-align:left; border: 1px solid black;'><b>Created By:</b> @created_by@</td> </tr> " \
                                "<tr><td style='text-align:left; border: 1px solid black;'><b>Risk Review Name:</b> @review_name@</td>" \
                                "<td style='text-align:left; border: 1px solid black;'><b>Portfolio name:</b> @portfolio_name@</td>" \
                                "<td style='text-align:left; border: 1px solid black;'><b>Service Chain Name:</b> @service_chain_name@</td></tr>" \
                                "<tr><td style='text-align:left; border: 1px solid black;'><b>Risk Name:</b> @risk_name@</td>" \
                                "<td colspan='2' style='text-align:left; border: 1px solid black;'><b>Risk Description:</b> @description@</td></tr> " \
                                "<tr><td rowspan='2' style='text-align:left; border: 1px solid black;'><b>Risk Statement:</b> <br>@statement@</td>" \
                                "<td style='text-align:left; border: 1px solid black;'><b>Risk Control Adequacy Level:</b> " \
                                "<div style='background-color:@ca_level_color@; height: 20px; width: 30px;'></div></td>" \
                                "<td style='text-align:left; border: 1px solid black;'><b>Process step name:</b> <br>@process_name@</td></tr> " \
                                "<tr><td style='text-align:left; border: 1px solid black;'><b>Risk Impact Level:</b> @impact_name@<br>@impact_desc@<br>" \
                                "<div style='background-color:@ri_level_color@; height: 20px; width: 30px;'></div></td>" \
                                "<td style='text-align:left; border: 1px solid black;'><b>Type of Impact:</b> <br>@ri_type@<br>@ri_desc@</td></tr> " \
                                "<tr><td rowspan='2' style='text-align:left'><b>Risk Impact:</b> <br>@ri@</td>" \
                                "<td style='text-align:left; border: 1px solid black;'><b>Risk Failure severity:</b> @rf_name@<br>@rf_desc@<br>" \
                                "<div style='background-color:@rfs_level_color@; height: 20px; width: 30px;'></div></td>" \
                                "<td style='text-align:left; border: 1px solid black;'><b>Type of Failure mode:</b> <br>@fm_type@<br>@fm_desc@</td></tr>" \
                                "<tr><td style='text-align:left; border: 1px solid black;'><b>Risk Tolerance Level:</b> @rt_name@<br>@rt_desc@<br>" \
                                "<div style='background-color:@rt_level_color@; height: 20px; width: 30px;'></div></td>" \
                                "<td style='text-align:left; border: 1px solid black;'><b>Is risk outside Tol? Y/N **</b></td> </tr> " \
                                "<tr><td style='text-align:left; border: 1px solid black;'><b>Risk Failure Mode:</b> <br>@rf_mode@</td>" \
                                "<td rowspan='2' colspan='2' style='text-align:left; border: 1px solid black;'><b>Details of ITIL failure:</b> <br>" \
                                "<b>L0:</b> @itil_l0@<br>@itil_l0_desc@<br>" \
                                "<b>L1:</b> @itil_l1@<br>@itil_l1_desc@<br>" \
                                "<b>L2:</b> @itil_l2@<br>@itil_l2_desc@<br>" \
                                "<b>L3:</b> @itil_l3@<br>@itil_l3_desc@<br></td></tr>" \
                                "<tr><td style='text-align:left; border: 1px solid black;'><b>Risk Failure mechanism:</b> <br>@rf_mechanism@</td></tr>" \
                                "</table>"
                risk_object_id = risk_object[0]
                risk_object_data = risk_object[1]
                # Replace data in HTML Template
                html_template = html_template.replace('@risk_id@', str(risk_object_id))
                html_template = html_template.replace('@created_date@', risk_object_data['created'])
                # html_template = html_template.replace('@created_by@', risk_object_data['created_by'])
                html_template = html_template.replace('@review_name@', risk_object_data['name'])
                # html_template = html_template.replace('@portfolio_name@', risk_object_data['portfolio_name'])
                # html_template = html_template.replace('@service_chain_name@', risk_object_data['service_chain_name'])
                # html_template = html_template.replace('@risk_name@', risk_object_data['risk_name'])
                html_template = html_template.replace('@description@', risk_object_data['description'])
                statement = 'MISSING' if not (risk_object_data['statement']) else risk_object_data['statement']
                html_template = html_template.replace('@statement@', statement)
                risk_prop = NeoTutum.risk_objects_properties[risk_object_id]
                if len([item for item in risk_prop if
                        item['metaDataLevel1']['metaDataLevel2']['name'] == 'Control_Adequacy']) > 0:
                    ca_level = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                                'Control_Adequacy'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0]['Value']
                else:
                    ca_level = 0
                html_template = html_template.replace('@ca_level_color@', self.__colors_mapper[str(ca_level)])
                process_name = 'MISSING' if not (risk_object_data['entityName']) else risk_object_data['entityName']
                html_template = html_template.replace('@process_name@', process_name)
                if len([item for item in risk_prop if
                        item['metaDataLevel1']['metaDataLevel2']['name'] == 'Impact_Level']) > 0:
                    impact_name = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                                   'Impact_Level'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                        'dataObjectElementId']['name']
                    impact_desc = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                                   'Impact_Level'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                        'dataObjectElementId']['description']
                    ri_level = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                                'Impact_Level'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0]['Value']
                else:
                    impact_name = 'MISSING'
                    impact_desc = 'MISSING'
                    ri_level = 0
                html_template = html_template.replace('@impact_name@', impact_name)
                html_template = html_template.replace('@impact_desc@', impact_desc)
                html_template = html_template.replace('@ri_level_color@', self.__colors_mapper[str(ri_level)])
                if len([item for item in risk_prop if
                        item['metaDataLevel1']['metaDataLevel2']['name'] == 'Impact_Type']) > 0:
                    ri_type = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                               'Impact_Type'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                        'dataObjectElementId']['name']
                    ri_desc = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                               'Impact_Type'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                        'dataObjectElementId']['description']
                else:
                    ri_type = 'MISSING'
                    ri_desc = 'MISSING'
                html_template = html_template.replace('@ri_type@', ri_type)
                html_template = html_template.replace('@ri_desc@', ri_desc)
                risk_impact = 'MISSING' if not (risk_object_data['impact']) else risk_object_data['impact']
                html_template = html_template.replace('@ri@', risk_impact)
                if len([item for item in risk_prop if
                        item['metaDataLevel1']['metaDataLevel2']['name'] == 'FMode_Severity']) > 0:
                    rf_name = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                               'FMode_Severity'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                        'dataObjectElementId']['name']
                    rf_desc = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                               'FMode_Severity'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                        'dataObjectElementId']['description']
                    rfs_level = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                                 'FMode_Severity'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                        'dataObjectElementId']['label'].split('_')[-1]
                else:
                    rf_name = 'MISSING'
                    rf_desc = 'MISSING'
                    rfs_level = 0
                html_template = html_template.replace('@rf_name@', rf_name)
                html_template = html_template.replace('@rf_desc@', rf_desc)
                html_template = html_template.replace('@rfs_level_color@', self.__colors_mapper[str(rfs_level)])
                if len([item for item in risk_prop if
                        item['metaDataLevel1']['metaDataLevel2']['name'] == 'FMode_Class']) > 0:
                    fm_type = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                               'FMode_Class'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                        'dataObjectElementId']['name']
                    fm_desc = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                               'FMode_Class'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                        'dataObjectElementId']['description']
                else:
                    fm_type = 'MISSING'
                    fm_desc = 'MISSING'
                html_template = html_template.replace('@fm_type@', fm_type)
                html_template = html_template.replace('@fm_desc@', fm_desc)
                if len([item for item in risk_prop if
                        item['metaDataLevel1']['metaDataLevel2']['name'] == 'Impact_Tolerance']) > 0:
                    rt_name = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                               'Impact_Tolerance'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                        'dataObjectElementId']['name']
                    rt_desc = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                               'Impact_Tolerance'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                        'dataObjectElementId']['description']
                    rt_level = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                                'Impact_Tolerance'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                        'dataObjectElementId']['label'].split('_')[-1]
                else:
                    rt_name = 'MISSING'
                    rt_desc = 'MISSING'
                    rt_level = 0
                html_template = html_template.replace('@rt_name@', rt_name)
                html_template = html_template.replace('@rt_desc@', rt_desc)
                html_template = html_template.replace('@rt_level_color@', self.__colors_mapper[str(rt_level)])
                rf_mode = 'MISSING' if not (risk_object_data['riskFailureMode']) else risk_object_data[
                    'riskFailureMode']
                html_template = html_template.replace('@rf_mode@', rf_mode)
                if len([item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                                                      'Fmech_ITIL_Vuln'][0]['metaDataLevel1']['metaDataLevel2'][
                           'elements']) > 0:
                    itil_l0 = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                               'Fmech_ITIL_Vuln'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                        'dataObjectElementId']['name']
                    itil_l0_desc = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                                    'Fmech_ITIL_Vuln'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                        'dataObjectElementId']['description']
                else:
                    itil_l0 = 'MISSING'
                    itil_l0_desc = 'MISSING'
                if len([item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                                                      'Fmech_ITIL_Vuln'][0]['metaDataLevel1']['metaDataLevel2'][
                           'elements']) > 1:
                    itil_l1 = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                               'Fmech_ITIL_Vuln'][0]['metaDataLevel1']['metaDataLevel2']['elements'][1][
                        'dataObjectElementId']['name']
                    itil_l1_desc = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                                    'Fmech_ITIL_Vuln'][0]['metaDataLevel1']['metaDataLevel2']['elements'][1][
                        'dataObjectElementId']['description']
                else:
                    itil_l1 = 'MISSING'
                    itil_l1_desc = 'MISSING'
                if len([item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                                                      'Fmech_ITIL_Vuln'][0]['metaDataLevel1']['metaDataLevel2'][
                           'elements']) > 2:
                    itil_l2 = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                               'Fmech_ITIL_Vuln'][0]['metaDataLevel1']['metaDataLevel2']['elements'][2][
                        'dataObjectElementId']['name']
                    itil_l2_desc = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                                    'Fmech_ITIL_Vuln'][0]['metaDataLevel1']['metaDataLevel2']['elements'][2][
                        'dataObjectElementId']['description']
                else:
                    itil_l2 = 'MISSING'
                    itil_l2_desc = 'MISSING'
                if len([item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                                                      'Fmech_ITIL_Vuln'][0]['metaDataLevel1']['metaDataLevel2'][
                           'elements']) > 3:
                    itil_l3 = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                               'Fmech_ITIL_Vuln'][0]['metaDataLevel1']['metaDataLevel2']['elements'][3][
                        'dataObjectElementId']['name']
                    itil_l3_desc = [item for item in risk_prop if item['metaDataLevel1']['metaDataLevel2']['name'] ==
                                    'Fmech_ITIL_Vuln'][0]['metaDataLevel1']['metaDataLevel2']['elements'][3][
                        'dataObjectElementId']['description']
                else:
                    itil_l3 = 'MISSING'
                    itil_l3_desc = 'MISSING'
                html_template = html_template.replace('@itil_l0@', itil_l0)
                html_template = html_template.replace('@itil_l0_desc@', itil_l0_desc)
                html_template = html_template.replace('@itil_l1@', itil_l1)
                html_template = html_template.replace('@itil_l1_desc@', itil_l1_desc)
                html_template = html_template.replace('@itil_l2@', itil_l2)
                html_template = html_template.replace('@itil_l2_desc@', itil_l2_desc)
                html_template = html_template.replace('@itil_l3@', itil_l3)
                html_template = html_template.replace('@itil_l3_desc@', itil_l3_desc)
                rf_mechanism = 'MISSING' if not (risk_object_data['causeFailureMechanism']) else risk_object_data[
                    'causeFailureMechanism']
                html_template = html_template.replace('@rf_mechanism@', rf_mechanism)
                # display(HTML(html_template))
                html_content += '\n' + html_template
            except:
                continue
        return html_content
        # with open(os.path.join(self.__output_risk_data, 'appendix.html'), 'w') as d:
        #     d.write(html_content)

    def create_causal_diagram_one(self, properties_names):
        html_content = ''
        properties = NeoTutum.risk_objects_properties
        for risk_objects_properties in properties.items():
            risk_object_id = risk_objects_properties[0]
            child_nodes = [item['parent'] for item in self.__risk_connections['links'] if
                           item['child'] == risk_object_id]
            risk_content = "<table style='width:35%; border: 1px solid black; float:right;'>"
            risk_content += self.fill_causal_diagram(risk_object_id, properties_names, 'parent', '', child_nodes)
            risk_content += "</table>"
            for index, child in enumerate(child_nodes):
                child_content = "<table style='width:35%; border: 1px solid black; margin-right:10px;'>"
                if index > 0:
                    child_content = child_content.replace('margin-right:10px;', 'margin-right:10px; margin-top:15px;')
                child_content += self.fill_causal_diagram(child, properties_names, 'child', str(index + 1), child_nodes)
                child_content += "</table>"
                risk_content += child_content
            # display(HTML(risk_content))
            html_content += risk_content + '<br>'
            html_content += '<hr><br>'
        return html_content
        # with open(os.path.join(self.__output_risk_data, 'causal_diagram.html'), 'w') as d:
        #     d.write('<html>' + html_content + '</html>')

    @staticmethod
    def fill_causal_diagram(risk_object_id, properties_names, node_type, count, child_nodes):
        if len(child_nodes) > 0:
            content = f"<tr bgcolor=\"#89CFF0\"><td colspan='2' style='text-align:center; border: 1px solid black;'><b>{node_type} node {count}</b></td></tr>"
            content += f"<tr><td colspan='2' style='text-align:center; border: 1px solid black;'><b>Risk ID {str(risk_object_id)}</b><br></td></tr>"
            current_risk_details = NeoTutum.risk_objects_properties[risk_object_id]
            new_properties = properties_names
            if node_type == 'parent':
                new_properties = properties_names + ['Implied_' + item for item in properties_names]
            for property_name in new_properties:
                property_data = f"<tr><td colspan='2' style='text-align:center; border: 1px solid black;'><b>{property_name}</b><br>"
                if 'Implied_' in property_name:
                    original_property_name = property_name.replace('Implied_', '')
                    property_values = []
                    for child in child_nodes:
                        try:
                            prop_level = int([item for item in NeoTutum.risk_objects_properties[child] if
                                              item['metaDataLevel1']['metaDataLevel2']['name']
                                              == original_property_name][0]['metaDataLevel1']['metaDataLevel2'][
                                                 'elements'][
                                                 0][
                                                 'dataObjectElementId']['label'].split('_')[-1])
                        except:
                            prop_level = 0
                        property_values.append(prop_level)
                    if sum(property_values) == 0:
                        implied_value = 'N/A'
                    else:
                        implied_value = str(sum(property_values) / len(property_values))
                    property_data += f"<b>{implied_value}</b></td></tr>"
                elif len([item for item in current_risk_details if
                          item['metaDataLevel1']['metaDataLevel2']['name'] == property_name]) == 0:
                    property_data += "<b>N/A</b></td></tr>"
                else:
                    try:
                        property_object_name = \
                            [item for item in current_risk_details if
                             item['metaDataLevel1']['metaDataLevel2']['name'] ==
                             property_name][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                                'dataObjectElementId']['name']
                    except:
                        property_object_name = 'MISSING'

                    try:
                        property_object_desc = \
                            [item for item in current_risk_details if
                             item['metaDataLevel1']['metaDataLevel2']['name'] ==
                             property_name][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                                'dataObjectElementId']['description']
                    except:
                        property_object_desc = 'MISSING'

                    try:
                        property_level = \
                            [item for item in current_risk_details if
                             item['metaDataLevel1']['metaDataLevel2']['name'] ==
                             property_name][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                                'dataObjectElementId']['label'].split('_')[-1]
                    except:
                        property_level = '0'
                    property_data += f"{property_object_name}<br>{property_object_desc}<br>" \
                                     f"<div style='background-color:{property_level}; height: 20px; width: 30px;'></div></td></tr>"
                content += property_data
            return content
        else:
            return ''

    def __analytics_json(self):
        try:
            model_data = {}
            settings = {'settings': self.__load_analytics_settings()}
            model_data.update(settings)
            # datasets = self.load_analytics_datasets()
            links = self.__load_analytics_links()
            model_data.update(links)
            networks = self.load_analytics_networks()
            model_data.update(networks)
            analytics_json = {'agenaRisk_JSON_Input': {'model': model_data}}
            analytics_json.update(self.__model_dataset)
            # analytics_json = json.dumps(analytics_json, indent=4)
            return analytics_json
        except Exception as ex:
            return ex

    @staticmethod
    def __load_analytics_template(templates, child_count):
        # with open(f'{str(child_count)}Child.json') as analytics_template:
        #     analytics_json = json.load(analytics_template)
        analytics_json = templates[f'{str(child_count)}child']
        return analytics_json

    # def __analytics_json_with_prop(self):
    #     analytics_json = ''
    #     ordered_layers = dict(reversed(list(self.__connection_tree.items())))
    #     for layer in ordered_layers.values():
    #         for node in layer:
    #             child_count = len(node['child_nodes'])
    #             analytics_json = self.__load_analytics_template(child_count)
    #             analytics_json = self.__fill_analytics_template(analytics_json, node)
    #     return analytics_json

    def __fill_analytics_template(self, analytics_json, config, node):
        parent_conf_level = next(
            item for item in analytics_json['body']['dataSet']['observations'] if
            item['node'] == 'parent_confidence_level')
        parent_conf_level['entries'][0]['value'] = node['confidence_level']
        parent_implied_value = next(
            item for item in analytics_json['body']['dataSet']['observations'] if
            item['node'] == 'parent_property_level')
        parent_properties = next(item for item in NeoTutum.risk_objects if item['id'] == node['node'])[
            'properties']
        parent_property_name = config['parent_property_name']
        parent_property_value = next(prop for prop in parent_properties if
                                     prop['metaDataLevel1']['metaDataLevel2']['name'] == parent_property_name)[
            'metaDataLevel1']['metaDataLevel2']['elements'][0]['Value']
        if isinstance(parent_property_value, int) or parent_property_value.isdigit():
            parent_property_value = int(parent_property_value)
        parent_implied_value['entries'][0]['value'] = parent_property_value
        ordered_child_list = sorted([item for item in node['child_nodes']], key=lambda d: d['strength'], reverse=True)
        for index, child in enumerate(ordered_child_list):
            child_conf_level = next(
                item for item in analytics_json['body']['dataSet']['observations'] if
                item['node'] == f'child{str(index + 1)}_confidence_level')
            child_conf_level['entries'][0]['value'] = node['confidence_level']
            child_implied_value = next(
                item for item in analytics_json['body']['dataSet']['observations'] if
                item['node'] == f'child{str(index + 1)}_property_level')
            if str(child['node']) in self.__implied_values.keys():
                child_implied_value['entries'] = self.__implied_values[str(child['node'])]['implied_value']
            else:
                child_properties = next(item for item in NeoTutum.risk_objects if item['id'] == child['node'])[
                    'properties']
                child_property_name = next(
                    item[f'child{index + 1}_property_name'] for item in config['child_nodes'] if
                    f'child{index + 1}_property_name' in item.keys())
                child_property_value = next(prop for prop in child_properties if
                                            prop['metaDataLevel1']['metaDataLevel2']['name'] == child_property_name)[
                    'metaDataLevel1']['metaDataLevel2']['elements'][0]['Value']
                if isinstance(child_property_value, int) or child_property_value.isdigit():
                    child_property_value = int(child_property_value)
                child_implied_value['entries'][0]['value'] = child_property_value
            child_connection_strength = next(
                item for item in analytics_json['body']['dataSet']['observations'] if
                item['node'] == f'child{str(index + 1)}_connection_strength')
            child_connection_strength['entries'][0]['value'] = child['strength']
            child_connection_confidence_level = next(
                item for item in analytics_json['body']['dataSet']['observations'] if
                item['node'] == f'child{str(index + 1)}_connection_confidence_level')
            child_connection_confidence_level['entries'][0]['value'] = child['child_connection_confidence_level']
        return analytics_json['body']

    @staticmethod
    def __load_analytics_settings():
        settings = {
            "parameterLearningLogging": False,
            "discreteTails": False,
            "sampleSizeRanked": 5,
            "convergence": 0.001,
            "simulationLogging": False,
            "iterations": 100,
            "tolerance": 1
        }
        return settings

    @staticmethod
    def __load_analytics_links():
        links = []
        # for model in self.meta_data.items():
        #     sourceNode = model[1]
        #     sourceNetwork = ''
        #     targetNetwork = ''
        #     type = 'Median'
        #     targetNode = ''
        return {'links': links}

    @staticmethod
    def __key_func(k):
        return k[1]['groupName']

    def load_analytics_networks(self):
        networks = []
        model_risk_objects = [model for model in self.meta_data.items() if model[1]['Type'] == 'model']
        self.__extract_dataObjects_connections()
        self.__extract_dataObjects()
        groups = []
        for key, value in groupby(model_risk_objects, self.__key_func):
            groups.append(list(value))
        for group in groups:
            nodes = [
                {'configuration': json.loads(node[1]['description'])['configuration'], 'id': node[1]['name'].lower()}
                for node in group]
            links = []
            for risk in group:
                risk_object_id = risk[0]
                d0_count = 0
                if risk[1]['name'].lower() == 'd0':
                    new_nodes = []
                    dataObject_id = \
                        [item for item in self.__dataObjects_connections if item['targetRef'] == risk_object_id
                         and item['objectType'] == 'Input'][0]['sourceRef']
                    dataObject = [item for item in self.__dataObjects if item['id'] == dataObject_id][0]
                    d0_index = nodes.index([item for item in nodes if item['id'] == 'd0'][0])
                    d0_content = nodes[d0_index]
                    d0_count = len(dataObject['dataObjectNew']['array']) - 1
                    datasets_data = []
                    for index, value in enumerate(dataObject['dataObjectNew']['array']):
                        node = {'configuration': d0_content['configuration'], 'id': f'd{str(index + 1)}'}
                        new_nodes.append(node)
                        dataset_row = {'node': f'd{str(index)}', 'entries': [{'weight': 1, 'value': f'{value[0]}'}],
                                       'network': dataObject['groupName']}
                        datasets_data.append(dataset_row)
                    for i in range(len(new_nodes) - 1):
                        nodes.insert(i + d0_index + 1, new_nodes[i])
                    self.__model_dataset = {'dataset': {'observations': datasets_data, 'displayable': True,
                                                        'active': True, 'id': 'Scenario 1', 'logPe': {}}}
                # Handle connections
                for connection in self.__risk_connections['links']:
                    if (connection['child'] == risk_object_id or connection['parent'] == risk_object_id) and connection[
                        'parent_type'] == 'model':
                        # link = {'parent': connection['parent'], 'child': connection['child']}
                        parent_name = [item[1] for item in model_risk_objects if item[0] == connection['parent']][0][
                            'name'].lower()
                        child_name = [item[1] for item in model_risk_objects if item[0] == connection['child']][0][
                            'name'].lower()
                        row_item = {'parent': parent_name, 'child': child_name}
                        if d0_count > 0:
                            new_row_items = [{'parent': row_item['parent'], 'child': f'd{index + 1}'} for index in
                                             range(d0_count)]
                            for i in range(len(new_row_items)):
                                if new_row_items[i] not in links:
                                    links.append(new_row_items[i])
                        else:
                            if row_item not in links:
                                links.append(row_item)
            _id = group[0][1]['groupName']
            networks.append({'nodes': nodes, 'links': links, 'id': _id})
        return {'networks': networks}

    # def __load_output_json(self):
    #     output_json = ''
    #     file_name = 'ModelRisk_Use_Case_Output.json'
    #     try:
    #         with open(file_name) as output_file:
    #             output_json = json.load(output_file)
    #         self.__output_data_object = os.path.join(os.getcwd(), file_name.replace('.json', ''),
    #                                                  datetime.now().strftime('%Y-%m-%d_%H-%M'))
    #         if not os.path.exists(self.__output_data_object):
    #             os.makedirs(self.__output_data_object)
    #     except Exception as ex:
    #         print(f'Error in {ex}')
    #     return output_json, file_name

    @staticmethod
    def __data_object_summary(data_object_id, result_json):
        summary = {'summaryStatistics':
                       [node['summaryStatistics'] for node in result_json['data']['agenaRisk_JSON_Output']['results'] if
                        node['node'] == data_object_id][0]}
        return summary

    # def handle_pdf_charts(self, data_object_id, title):
    #     output_json, file_name = self.__load_output_json()
    #     if len(output_json) > 0:
    #         summary = self.__data_object_summary(data_object_id, file_name, output_json)
    #         result_values = output_json['results']
    #         data_node = [node for node in result_values if node['node'] == data_object_id][0]
    #         data_labels = [label['label'] for label in data_node['resultValues']]
    #         x_axis = [item.split('-')[0] for item in data_labels]
    #         x_axis.append(data_labels[len(data_labels) - 1].split('-')[1])
    #         result_data = [item['value'] for item in data_node['resultValues']]
    #         draw_pdf_chart(result_data=result_data, data_labels=data_labels,
    #                        output_directory=self.__output_data_object, summary=summary,
    #                        title=title, data_object_id=data_object_id)
    #     else:
    #         print('Error in loading output json file')

    def handle_analytics_bar_charts(self, result_json, data_object_id, pack_index, property_name=None, risk_id=None):
        if property_name is not None:
            title = f'{risk_id} && {property_name}'
        else:
            title = f'{data_object_id} without property'
        summary = self.__data_object_summary(data_object_id, result_json)
        result_values = result_json['data']['agenaRisk_JSON_Output']['results']
        data_node = [node for node in result_values if node['node'] == data_object_id][0]
        data_labels = [label['label'] for label in data_node['resultValues']]
        result_data = [item['value'] for item in data_node['resultValues']]
        # if data_object_id == 'parent_implied_property':
        #     data_object_id = self.__analysis_packs[pack_index]['parent']
        node_id = data_object_id
        for node in self.__analysis_packs[pack_index].keys():
            if f'{node}_implied_property' in data_object_id:
                node_id = self.__analysis_packs[pack_index][node]
            elif f'{node}_property_level' in data_object_id:
                node_id = self.__analysis_packs[pack_index][node]
        analytic_chart = draw_analytic_bar_chart(result_data=result_data, data_labels=data_labels, summary=summary,
                                                 title=title, data_object_id=str(node_id), colors=self.__Colors)
        return analytic_chart

    def handle_analytics_pdf_charts(self, result_json, data_object_id, pack_index, property_name=None, risk_id=None):
        if property_name is not None:
            title = f'{risk_id} && {property_name}'
        else:
            title = f'{data_object_id} without property'
        summary = self.__data_object_summary(data_object_id, result_json)
        result_values = result_json['data']['agenaRisk_JSON_Output']['results']
        data_node = [node for node in result_values if node['node'] == data_object_id][0]
        data_labels_min = [float(label['label'].split('-')[0].strip()) for label in data_node['resultValues']]
        data_labels_max = [float(label['label'].split('-')[1].strip()) for label in data_node['resultValues']]
        delta = [a - b for a, b in zip(data_labels_max, data_labels_min)]
        inc = []
        for i in range(len(delta)):
            if i == 0:
                inc.append(delta[i])
            else:
                inc.append(delta[i] + delta[i - 1])
        result_data = [float(item['value']) for item in data_node['resultValues']]
        values = [a / b for a, b in zip(result_data, delta)]
        node_id = data_object_id
        for node in self.__analysis_packs[pack_index].keys():
            if f'{node}_implied_property' in data_object_id:
                node_id = self.__analysis_packs[pack_index][node]
            elif f'{node}_property_level' in data_object_id:
                node_id = self.__analysis_packs[pack_index][node]
        analytic_chart = draw_analytic_pdf_chart(result_data=values, data_labels=inc, summary=summary,
                                                 title=title, data_object_id=str(node_id))
        return analytic_chart

    def __classify_connection_tree(self):
        """Split connections into layers for the bayesian_analytics"""
        connections = NeoTutum.risk_assessment['riskConnections']
        parent_list = list(set([item['targetRef'] for item in connections]))
        child_list = list(set([item['sourceRef'] for item in connections]))
        node_ids = [list(set(parent_list) - set(child_list))[0]]
        parent_risk = [risk for risk in NeoTutum.risk_objects if risk['id'] == node_ids[0]][0]
        parent_confidence_level = \
            [prop for prop in parent_risk['properties'] if prop['metaDataLevel1']['metaDataLevel2']['name'] ==
             'Confidence Level'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0]['dataObjectElementId'][
                'label'].split('_')[1]
        child_nodes = []
        for item in connections:
            if item['targetRef'] == node_ids[0]:
                node_risk = [risk for risk in NeoTutum.risk_objects if risk['id'] == item['sourceRef']][0]
                child_confidence_level = \
                    [prop for prop in node_risk['properties'] if prop['metaDataLevel1']['metaDataLevel2']['name'] ==
                     'Confidence Level'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0]['dataObjectElementId'][
                        'label'].split('_')[1]
                record = {'node': item['sourceRef'], 'strength': item['scalar'],
                          'confidence_level': int(child_confidence_level),
                          'child_connection_confidence_level': int(item['confidenceLevel'])}
                child_nodes.append(record)
        self.__connection_tree['0'] = [
            {'node': node_ids[0], 'confidence_level': int(parent_confidence_level),
             'child_nodes': child_nodes}]
        next_nodes = [item['sourceRef'] for item in connections if item['targetRef'] == node_ids[0]]
        self.__connection_tree_members(node_ids=next_nodes, layer_index=1)

        # next_layer = sorted([item for item in connections if item['targetRef'] == parent], key=lambda d: d['scalar'],
        #                     reverse=True)
        # for node in next_layer:
        #     node_id = node['sourceRef']
        #     tree[f'{layer_index}'] = self.connection_tree_members(node_id)

    def __connection_tree_members(self, node_ids, layer_index):
        connections = NeoTutum.risk_assessment['riskConnections']
        next_nodes = []
        layer_nodes = []
        for node in node_ids:
            parent_risk = [risk for risk in NeoTutum.risk_objects if risk['id'] == node][0]
            parent_confidence_level = \
                [prop for prop in parent_risk['properties'] if prop['metaDataLevel1']['metaDataLevel2']['name'] ==
                 'Confidence Level'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0]['dataObjectElementId'][
                    'label'].split('_')[1]
            child_nodes = []
            for item in connections:
                if item['targetRef'] == node:
                    node_risk = [risk for risk in NeoTutum.risk_objects if risk['id'] == item['sourceRef']][0]
                    child_confidence_level = \
                        [prop for prop in node_risk['properties'] if prop['metaDataLevel1']['metaDataLevel2']['name'] ==
                         'Confidence Level'][0]['metaDataLevel1']['metaDataLevel2']['elements'][0][
                            'dataObjectElementId'][
                            'label'].split('_')[1]
                    record = {'node': item['sourceRef'], 'strength': item['scalar'],
                              'implied_value': '', 'confidence_level': int(child_confidence_level),
                              'child_connection_confidence_level': int(item['confidenceLevel'])}
                    child_nodes.append(record)
            next_nodes.extend([item['sourceRef'] for item in connections if item['targetRef'] == node])
            if len(child_nodes) > 0:
                layer_nodes.append({'node': node, 'implied_value': '', 'confidence_level': int(parent_confidence_level),
                                    'child_nodes': child_nodes})
        if len(next_nodes) > 0:
            self.__connection_tree[f'{layer_index}'] = layer_nodes
            self.__connection_tree_members(node_ids=list(set(next_nodes)), layer_index=layer_index + 1)

    def agenarisk_analytics_charts(self, templates, prop_analysis=True):
        """ Generate all charts in one process """
        analytics_input = []
        analytics_charts = []
        analytics_result_output = {}
        if prop_analysis:
            self.__classify_connection_tree()
            ordered_layers = dict(reversed(list(self.__connection_tree.items())))
            for layer in ordered_layers.values():
                for node in layer:
                    child_count = len(node['child_nodes'])
                    analytics_json = self.__load_analytics_template(templates, child_count)
                    config = templates['config'][f'{child_count}child']
                    analytics_input_json = self.__fill_analytics_template(analytics_json, config, node)
                    analytics_result = self.__get_analytics_engine_output(analytics_input_json)
                    implied_value = next(
                        item['resultValues'] for item in analytics_result['data']['agenaRisk_JSON_Output']['results'] if
                        item['node'] == 'parent_implied_property')
                    node['implied_value'] = implied_value
                    implied_row = {'implied_value': implied_value,
                                   'property_name': config['parent_property_name']}
                    self.__implied_values[str(node['node'])] = implied_row
                    analytics_input.append(analytics_result)
                    analysis_pack = {'parent': node['node']}
                    for index, child in enumerate(node['child_nodes']):
                        analysis_pack[f'child{str(index + 1)}'] = child['node']
                    self.__analysis_packs.append(analysis_pack)

            # analytics_input_json = self.__analytics_json_with_prop()
        else:
            analytics_input_json = self.__analytics_json()
            analytics_input.append(self.__get_analytics_engine_output(analytics_input_json))
        if len(analytics_input) > 0:
            for index, analytic in enumerate(analytics_input):
                data_objects_ids = [item['node'] for item in analytic['data']['agenaRisk_JSON_Output']['results']]
                for object_id in data_objects_ids:
                    if len([item for item in NeoTutum.risk_objects if item['name'].lower() == object_id]) > 0:
                        chart_type = next(item['statement'] for item in NeoTutum.risk_objects if item['name'].lower() == object_id)
                        if chart_type == 'pdf':
                            analytics_charts.append(
                                self.handle_analytics_pdf_charts(result_json=analytic,
                                                                 data_object_id=object_id,
                                                                 pack_index=index))
                        elif chart_type == 'barchart':
                            analytics_charts.append(
                                self.handle_analytics_bar_charts(result_json=analytic, data_object_id=object_id,
                                                                 pack_index=index))
                    else:
                        for node in self.__analysis_packs[index].keys():
                            if f'{node}_implied_property' in object_id:
                                risk_id = self.__analysis_packs[index][node]
                                chart_type = next(item['statement'] for item in NeoTutum.risk_objects if item['id'] == risk_id)
                                property_name = self.__implied_values[f'{risk_id}']['property_name']
                                if chart_type == 'pdf':
                                    analytics_charts.append(
                                        self.handle_analytics_pdf_charts(result_json=analytic,
                                                                         data_object_id=object_id,
                                                                         pack_index=index, property_name=property_name,
                                                                         risk_id=risk_id))
                                elif chart_type == 'barchart':
                                    analytics_charts.append(
                                        self.handle_analytics_bar_charts(result_json=analytic, data_object_id=object_id,
                                                                         pack_index=index, property_name=property_name,
                                                                         risk_id=risk_id))
        analytics_result_output['charts'] = analytics_charts
        analytics_result_output['implied_values'] = self.__implied_values
        return analytics_result_output

    @staticmethod
    def __get_analytics_engine_output(analytics_input_json):
        """ return analytics engine result """
        url = 'https://stage-service-dot-neotutum.nw.r.appspot.com/JSONAnalytics/JsonIO/Analytics/e2e'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
        result = requests.post(url=url, headers=headers, json=analytics_input_json)
        if result.status_code == 200:
            body = json.loads(result.content.decode())
        else:
            body = {}
        # with open('output.json') as analytics_template:
        #     body = json.load(analytics_template)
        return body

    def __save_analytics_charts(self):
        """save analytics charts to the backend"""
        url = 'https://stage-service-dot-neotutum.nw.r.appspot.com/analytics_charts'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
        result = requests.post(url=url, headers=headers, data={'risk_assessment_id': self.__risk_assessment_id,
                                                               'charts': self.__analytics_charts_details})
        if result.status_code == '201':
            message = f'{result.status_code}: Chart saved successfully'
        else:
            message = f'{result.status_code}: Error in saving chart'
        return message

    def __save_bulk_analytics_charts(self):
        """save analytics charts to the backend (bulk)"""
        url = 'https://stage-service-dot-neotutum.nw.r.appspot.com/analytics_charts/bulkCharts'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
        result = requests.post(url=url, headers=headers, json={'risk_assessment_id': self.__risk_assessment_id,
                                                               'charts': self.__analytics_charts_details})
        # result = requests.post(url=url, headers=headers, data=item)
        if result.status_code == '201':
            message = f'{result.status_code}: Charts saved successfully'
        else:
            message = f'{result.status_code}: Error in saving charts'
        return message

    @staticmethod
    def __notebook_generator(source):
        cells = []

    def show_errors_log(self):
        return self.__errors_log
