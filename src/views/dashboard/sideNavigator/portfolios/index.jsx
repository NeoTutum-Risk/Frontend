import {
  Button,
  FormGroup,
  H5,
  Icon,
  InputGroup,
  Intent,
  Menu,
  MenuItem,
  Tree,
} from '@blueprintjs/core'
import { Classes, Popover2, Tooltip2 } from '@blueprintjs/popover2'
import cloneDeep from 'lodash/cloneDeep'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil'
import { EMPTY_BPMN } from '../../../../constants'
import {
  addNewBpmn,
  addNewPlatform,
  addServiceChain,
  archiveBpmn,
  updateBpmnStatus,
} from '../../../../services'
import { platformState, protfoliosState } from '../../../../store/portfolios'
import { windowsState } from '../../../../store/windows'
import { generateID } from '../../../../utils/generateID'
import {
  showDangerToaster,
  showSuccessToaster,
  showWarningToaster,
} from '../../../../utils/toaster'
import { xmlParser } from '../../../../utils/xmlParser'

export const Portfolios = () => {
  const [portfolios, setPortfolios] = useRecoilState(protfoliosState)
  const [nodes, setNodes] = useState(null)
  const [portfolioPopOver, setPortfolioPopOver] = useState(null)
  const [portfolioPopOverOpenId, setPortfolioPopOverOpenId] = useState(null)
  const [newElmentToPortfolioName, setNewElmentToPortfolioName] = useState(null)
  const [elmentToPortfolioNameError, setElmentToPortfolioNameError] = useState(null)
  const [isAddServiceLoading, setIsAddServiceLoading] = useState(false)
  const [newPlatformName, setNewPlatformName] = useState(null)
  const [newPlatformNameError, setNewPlatformNameError] = useState(null)
  const [serviceChainPopOver, setServiceChainPopOver] = useState(null)
  const [serviceChainPopOverOpenId, setServiceChainPopOverOpenId] = useState(null)
  const setWindows = useSetRecoilState(windowsState)
  const [serviceContextMenu, setServiceContextMenu] = useState(null)
  const [portfolioContextMenu, setPortfolioContextMenu] = useState(null)
  const [platformContextMenu, setPlatformContextMenu] = useState(null)
  const [bpmnContextMenu, setBpmnContextMenu] = useState(null)
  const [platformPopOver, setPlatformPopOver] = useState(null)
  const [PlatformPopOverOpenId, setPlatformPopOverOpenId] = useState(null)
  const [newElmentToPlatformName, setNewElmentToPlatformName] = useState(null)
  const [elmentToPlatformNameError, setElmentToPlatformNameError] = useState(null)

  useOnClickOutsideContextMenu(() => {
    setPortfolioContextMenu(null)
    setPlatformContextMenu(null)
    setServiceContextMenu(null)
    setBpmnContextMenu(null)
  })

  const onNodeContextMenu = useCallback((node, _, e) => {
    e.preventDefault()
    // eslint-disable-next-line default-case
    switch (node.nodeData.type) {
      case 'serviceChain':
        setServiceContextMenu(node.id)
        break
      case 'platform':
        setPlatformContextMenu(node.id)
        break
      case 'protfolio':
        setPortfolioContextMenu(node.id)
        break
      case 'bpmn':
        setBpmnContextMenu(node.id)
        break
    }
  }, [])

  const updatePlatform = useRecoilCallback(
    ({ set }) =>
      ({ bpmnId, file }) => {
        set(platformState(bpmnId), { xml: file })
      },
    []
  )

  const bpmnFileRef = useRef(null)

  const addNewWindow = useCallback(
    ({ data, type }) => {
      setWindows(prevWindows =>
        prevWindows.find(window => window.data.id === data.id)
          ? prevWindows
          : [{ type, data, id: generateID() }, ...prevWindows]
      )
    },
    [setWindows]
  )

  const onImportBpmnFile = useCallback(
    async event => {
      const bpmnFile = await event.target.files[0].text()
      const fileName = event.target.files[0].name

      const { data } = await addNewBpmn({
        file: bpmnFile,
        creatorId: 1,
        fileName,
        platformId: platformPopOver.platformId,
        ...xmlParser(bpmnFile),
      })

      setPortfolios(prevPortfolios => ({
        ...prevPortfolios,
        data: prevPortfolios.data.map(portfolio =>
          portfolio.id === platformPopOver.portfolioId
            ? {
                ...portfolio,
                serviceChains:
                  portfolio?.serviceChains.map(serviceChain =>
                    platformPopOver.serviceChainId === serviceChain.id
                      ? {
                          ...serviceChain,
                          platforms: serviceChain?.platforms.map(platform =>
                            platform.id === platformPopOver.platformId
                              ? {
                                  ...platform,
                                  bpmnFiles: platform.bpmnFiles
                                    ? [data.data, ...platform.bpmnFiles]
                                    : [data.data],
                                }
                              : platform
                          ),
                        }
                      : serviceChain
                  ) ?? [],
              }
            : portfolio
        ),
      }))

      updatePlatform({ file: bpmnFile, bpmnId: data.data.id })
      addNewWindow({ type: 'bpmn', data: data.data })
      showSuccessToaster(`New bpmn file uploaded successfully`)
    },
    [addNewWindow, platformPopOver, setPortfolios, updatePlatform]
  )

  const addElmentToPortfolio = useCallback(
    async event => {
      event.preventDefault()

      if (!newElmentToPortfolioName) {
        return setElmentToPortfolioNameError('Name is required')
      }

      if (portfolioPopOver.type !== 'New Service Chain') {
        return setPortfolioPopOverOpenId(null)
      }

      try {
        setIsAddServiceLoading(true)
        setElmentToPortfolioNameError(null)
        const { data } = await addServiceChain({
          name: newElmentToPortfolioName,
          portfolioId: portfolioPopOver.portfolio.id,
        })

        setPortfolios(prevPortfolios => ({
          ...prevPortfolios,
          data: prevPortfolios.data.map(portfolio =>
            portfolio.id === portfolioPopOver.portfolio.id
              ? {
                  ...portfolio,
                  serviceChains: portfolio.serviceChains
                    ? [data.data, ...portfolio.serviceChains]
                    : [data.data],
                }
              : portfolio
          ),
        }))

        setIsAddServiceLoading(false)

        setPortfolioPopOverOpenId(null)

        setNodes(prevNodes =>
          setNodeAttribute(prevNodes, [portfolioPopOver.portfolioIdx], 'isExpanded', true)
        )

        showSuccessToaster(`${newElmentToPortfolioName} has been successfully created`)
      } catch (error) {
        setElmentToPortfolioNameError(error.message)
        showDangerToaster(error.message)
        setIsAddServiceLoading(false)
      }
    },
    [newElmentToPortfolioName, portfolioPopOver, setPortfolios]
  )

  const addPlatform = useCallback(
    async event => {
      event.preventDefault()

      if (!newPlatformName) {
        return setNewPlatformNameError('Name is required')
      }

      try {
        setIsAddServiceLoading(true)
        setNewPlatformNameError(null)

        const { data } = await addNewPlatform({
          name: newPlatformName,
          serviceChainId: serviceChainPopOver.serviceChainId,
        })

        setPortfolios(prevPortfolios => ({
          ...prevPortfolios,
          data: prevPortfolios.data.map(portfolio =>
            portfolio.id === serviceChainPopOver.portfolioId
              ? {
                  ...portfolio,
                  serviceChains:
                    portfolio?.serviceChains.map(serviceChain =>
                      serviceChainPopOver.serviceChainId === serviceChain.id
                        ? {
                            ...serviceChain,
                            platforms: serviceChain?.platforms
                              ? [data.data, ...serviceChain.platforms]
                              : [data.data],
                          }
                        : serviceChain
                    ) ?? [],
                }
              : portfolio
          ),
        }))

        setIsAddServiceLoading(false)
        setServiceChainPopOverOpenId(null)

        setNodes(prevNodes =>
          setNodeAttribute(
            prevNodes,
            [serviceChainPopOver.portfolioIdx, serviceChainPopOver.serviceChainIdx],
            'isExpanded',
            true
          )
        )

        showSuccessToaster(`${newPlatformName} has been successfully created`)
      } catch (error) {
        setNewPlatformNameError(error.message)
        showDangerToaster(error.message)
        setIsAddServiceLoading(false)
      }
    },
    [newPlatformName, serviceChainPopOver, setPortfolios]
  )

  const ServiceChainPopOverContent = useMemo(
    () => (
      <div key='text3'>
        <H5>{portfolioPopOver?.type}</H5>
        <form onSubmit={addElmentToPortfolio}>
          <FormGroup
            label='Name'
            labelInfo='(required)'
            intent={elmentToPortfolioNameError ? Intent.DANGER : Intent.NONE}
            helperText={elmentToPortfolioNameError}
            labelFor='newServiceChainName'
          >
            <InputGroup
              required
              id='newServiceChainName'
              onChange={event => {
                setElmentToPortfolioNameError(false)
                setNewElmentToPortfolioName(event.target.value)
              }}
            />
          </FormGroup>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
            <Button
              className={Classes.POPOVER2_DISMISS}
              disabled={isAddServiceLoading}
              style={{ marginRight: 10 }}
              onClick={() => {
                setElmentToPortfolioNameError(false)
                setPortfolioPopOverOpenId(null)
              }}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              loading={isAddServiceLoading}
              intent={Intent.SUCCESS}
              className={Classes.POPOVER2_DISMISS}
            >
              Add
            </Button>
          </div>
        </form>
      </div>
    ),
    [portfolioPopOver, addElmentToPortfolio, elmentToPortfolioNameError, isAddServiceLoading]
  )

  const onPortfolioMenuClick = useCallback(({ portfolioId, type, portfolioIdx, portfolio }) => {
    setNewElmentToPortfolioName(null)
    setElmentToPortfolioNameError(null)
    setPortfolioPopOver({ type, portfolio, portfolioIdx })
    setPortfolioPopOverOpenId(portfolioId)
    setServiceContextMenu(null)
    setPortfolioContextMenu(null)
    setPlatformContextMenu(null)
    setBpmnContextMenu(null)
  }, [])

  const onServiceChainMenuClick = useCallback(
    ({ serviceChain, serviceChainId, portfolioId, portfolioIdx, serviceChainIdx }) => {
      setNewPlatformName(null)
      setNewPlatformNameError(null)
      setServiceChainPopOver({
        serviceChain,
        serviceChainId,
        portfolioId,
        portfolioIdx,
        serviceChainIdx,
      })
      setServiceChainPopOverOpenId(serviceChainId)
      setServiceContextMenu(null)
      setPortfolioContextMenu(null)
      setPlatformContextMenu(null)
      setBpmnContextMenu(null)
    },
    []
  )

  const onPlatformMenuClick = useCallback(
    ({
      platform,
      platformId,
      portfolioId,
      portfolioIdx,
      serviceChainIdx,
      serviceChainId,
      platformIdx,
      newFile,
    }) => {
      setNewElmentToPlatformName(null)
      setElmentToPlatformNameError(null)
      setPlatformPopOver({
        platform,
        platformId,
        portfolioId,
        portfolioIdx,
        serviceChainIdx,
        serviceChainId,
        platformIdx,
      })
      if (newFile) setPlatformPopOverOpenId(platformId)
      setServiceContextMenu(null)
      setPortfolioContextMenu(null)
      setPlatformContextMenu(null)
      setBpmnContextMenu(null)
    },
    []
  )

  const addEmptyBpmn = useCallback(
    async event => {
      event.preventDefault()

      if (!newElmentToPlatformName) {
        return setElmentToPlatformNameError('Name is required')
      }

      setIsAddServiceLoading(true)
      setElmentToPlatformNameError(null)

      try {
        const { data } = await addNewBpmn({
          file: EMPTY_BPMN,
          creatorId: 1,
          fileName: newElmentToPlatformName + '.bpmn',
          platformId: platformPopOver.platformId,
        })

        setPortfolios(prevPortfolios => ({
          ...prevPortfolios,
          data: prevPortfolios.data.map(portfolio =>
            portfolio.id === platformPopOver.portfolioId
              ? {
                  ...portfolio,
                  serviceChains:
                    portfolio?.serviceChains.map(serviceChain =>
                      platformPopOver.serviceChainId === serviceChain.id
                        ? {
                            ...serviceChain,
                            platforms: serviceChain?.platforms.map(platform =>
                              platform.id === platformPopOver.platformId
                                ? {
                                    ...platform,
                                    bpmnFiles: platform.bpmnFiles
                                      ? [data.data, ...platform.bpmnFiles]
                                      : [data.data],
                                  }
                                : platform
                            ),
                          }
                        : serviceChain
                    ) ?? [],
                }
              : portfolio
          ),
        }))

        setPlatformPopOverOpenId(null)

        updatePlatform({ file: EMPTY_BPMN, bpmnId: data.data.id })
        addNewWindow({ type: 'bpmn', data: data.data })
        showSuccessToaster(`New bpmn graph added successfully`)
      } catch (error) {
        setElmentToPlatformNameError(error.message)
        showDangerToaster(error.message)
        setIsAddServiceLoading(false)
      }
    },
    [addNewWindow, newElmentToPlatformName, platformPopOver, setPortfolios, updatePlatform]
  )

  const PlatformPopOverContent = useMemo(
    () => (
      <div key='text2'>
        <H5>New Platform</H5>
        <form onSubmit={addPlatform}>
          <FormGroup
            label='Name'
            labelInfo='(required)'
            intent={newPlatformNameError ? Intent.DANGER : Intent.NONE}
            helperText={newPlatformNameError}
            labelFor='newPlatformName1'
          >
            <InputGroup
              required
              id='newPlatformName1'
              onChange={event => {
                setNewPlatformNameError(false)
                setNewPlatformName(event.target.value)
              }}
            />
          </FormGroup>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
            <Button
              className={Classes.POPOVER2_DISMISS}
              disabled={isAddServiceLoading}
              style={{ marginRight: 10 }}
              onClick={() => {
                setNewPlatformNameError(false)
                setServiceChainPopOverOpenId(null)
              }}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              loading={isAddServiceLoading}
              intent={Intent.SUCCESS}
              className={Classes.POPOVER2_DISMISS}
            >
              Add
            </Button>
          </div>
        </form>
      </div>
    ),
    [addPlatform, isAddServiceLoading, newPlatformNameError]
  )

  const BpmnPopOverContent = useMemo(
    () => (
      <div key='text1'>
        <H5>New BPMN</H5>
        <form onSubmit={addEmptyBpmn}>
          <FormGroup
            label='Name'
            labelInfo='(required)'
            intent={elmentToPlatformNameError ? Intent.DANGER : Intent.NONE}
            helperText={elmentToPlatformNameError}
            labelFor='newPlatformName'
          >
            <InputGroup
              required
              id='newPlatformName'
              onChange={event => {
                setElmentToPlatformNameError(false)
                setNewElmentToPlatformName(event.target.value)
              }}
            />
          </FormGroup>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
            <Button
              className={Classes.POPOVER2_DISMISS}
              disabled={isAddServiceLoading}
              style={{ marginRight: 10 }}
              onClick={() => {
                setElmentToPlatformNameError(false)
                setNewElmentToPlatformName(null)
                setPlatformPopOverOpenId(null)
              }}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              loading={isAddServiceLoading}
              intent={Intent.SUCCESS}
              className={Classes.POPOVER2_DISMISS}
            >
              Add
            </Button>
          </div>
        </form>
      </div>
    ),
    [addEmptyBpmn, elmentToPlatformNameError, isAddServiceLoading]
  )

  const getBpmnFile = useRecoilCallback(
    ({ snapshot }) =>
      async bpmnId =>
        snapshot.getPromise(platformState(bpmnId)),
    []
  )

  const onBpmnStateChange = useCallback(
    async ({ bpmnId, status, platformId, portfolioId, serviceChainId }) => {
      try {
        const data = await getBpmnFile(bpmnId)

        if (status === 'changed' && (!data.xml || !data.changed)) {
          return showWarningToaster('There is no new changes')
        }

        await updateBpmnStatus({
          id: bpmnId,
          status,
          ...(status === 'changed' && { fileData: data.xml }),
        })

        setPortfolios(prevPortfolios => ({
          ...prevPortfolios,
          data: prevPortfolios.data.map(portfolio =>
            portfolio.id === portfolioId
              ? {
                  ...portfolio,
                  serviceChains:
                    portfolio?.serviceChains.map(serviceChain =>
                      serviceChainId === serviceChain.id
                        ? {
                            ...serviceChain,
                            platforms: serviceChain?.platforms.map(platform =>
                              platform.id === platformId
                                ? {
                                    ...platform,
                                    bpmnFiles: platform.bpmnFiles.map(bpmnFile =>
                                      bpmnFile.id === bpmnId ? { ...bpmnFile, status } : bpmnFile
                                    ),
                                  }
                                : platform
                            ),
                          }
                        : serviceChain
                    ) ?? [],
                }
              : portfolio
          ),
        }))
        showSuccessToaster(`${status} successfully`)
      } catch (error) {
        showDangerToaster(error?.response?.data?.msg ?? error.message)
      }
    },
    [getBpmnFile, setPortfolios]
  )

  const onBpmnArchive = useCallback(
    async ({ bpmnId, platformId, portfolioId, serviceChainId }) => {
      try {
        await archiveBpmn({ id: bpmnId })
        showSuccessToaster('successfully archived')
        setPortfolios(prevPortfolios => ({
          ...prevPortfolios,
          data: prevPortfolios.data.map(portfolio =>
            portfolio.id === portfolioId
              ? {
                  ...portfolio,
                  serviceChains:
                    portfolio?.serviceChains.map(serviceChain =>
                      serviceChainId === serviceChain.id
                        ? {
                            ...serviceChain,
                            platforms: serviceChain?.platforms.map(platform =>
                              platform.id === platformId
                                ? {
                                    ...platform,
                                    bpmnFiles: platform.bpmnFiles.map(bpmnFile =>
                                      bpmnFile.id === bpmnId
                                        ? { ...bpmnFile, status: 'archive' }
                                        : bpmnFile
                                    ),
                                  }
                                : platform
                            ),
                          }
                        : serviceChain
                    ) ?? [],
                }
              : portfolio
          ),
        }))
      } catch (error) {
        showDangerToaster(error?.response?.data?.msg ?? error.message)
      }
    },
    [setPortfolios]
  )

  useEffect(() => {
    setNodes(prevNodes =>
      portfolios.data.map((portfolio, portfolioIdx) => ({
        id: portfolio.id,
        hasCaret: portfolio?.serviceChains?.length > 0,
        icon: 'folder-close',
        isExpanded: prevNodes?.find(node => portfolio.id === node.id)?.isExpanded ?? false,
        label: (
          <Popover2
            popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
            content={ServiceChainPopOverContent}
            isOpen={portfolio.id === portfolioPopOverOpenId}
          >
            <Popover2
              content={
                <Menu>
                  <MenuItem
                    textClassName='target_menu'
                    icon='plus'
                    text='New Template'
                    onClick={() =>
                      onPortfolioMenuClick({
                        portfolioId: portfolio.id,
                        type: 'New Template',
                        portfolio,
                        portfolioIdx,
                      })
                    }
                  />
                  <MenuItem
                    textClassName='target_menu'
                    icon='plus'
                    text='New Risk Assessment'
                    onClick={() =>
                      onPortfolioMenuClick({
                        portfolioId: portfolio.id,
                        type: 'New Risk Assessment',
                        portfolio,
                        portfolioIdx,
                      })
                    }
                  />
                  <MenuItem
                    textClassName='target_menu'
                    icon='plus'
                    text='New Model'
                    onClick={() =>
                      onPortfolioMenuClick({
                        portfolioId: portfolio.id,
                        type: 'New Model',
                        portfolio,
                        portfolioIdx,
                      })
                    }
                  />
                  <MenuItem
                    textClassName='target_menu'
                    icon='plus'
                    text='New Code'
                    onClick={() =>
                      onPortfolioMenuClick({
                        portfolioId: portfolio.id,
                        type: 'New Code',
                        portfolio,
                        portfolioIdx,
                      })
                    }
                  />
                  <MenuItem
                    textClassName='target_menu'
                    icon='plus'
                    text='New Service Chain'
                    onClick={() =>
                      onPortfolioMenuClick({
                        portfolioId: portfolio.id,
                        type: 'New Service Chain',
                        portfolio,
                        portfolioIdx,
                      })
                    }
                  />
                </Menu>
              }
              isOpen={portfolio.id === portfolioContextMenu}
            >
              {portfolio.name}
            </Popover2>
          </Popover2>
        ),
        nodeData: { type: 'protfolio', data: portfolio },
        childNodes:
          portfolio?.serviceChains?.map((serviceChain, serviceChainIdx) => ({
            id: serviceChain.id,
            hasCaret: serviceChain?.platforms?.length > 0,
            icon: 'exchange',
            isExpanded:
              prevNodes
                ?.find(node => portfolio.id === node.id)
                ?.childNodes.find(child => child.id === serviceChain.id)?.isExpanded ?? false,
            label: (
              <Popover2
                popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
                content={PlatformPopOverContent}
                isOpen={serviceChain.id === serviceChainPopOverOpenId}
              >
                <Popover2
                  content={
                    <Menu>
                      <MenuItem
                        textClassName='target_menu'
                        icon='plus'
                        text='New Platform'
                        onClick={() =>
                          onServiceChainMenuClick({
                            serviceChain,
                            serviceChainId: serviceChain.id,
                            portfolioId: portfolio.id,
                            portfolioIdx,
                            serviceChainIdx,
                          })
                        }
                      />
                    </Menu>
                  }
                  isOpen={serviceChain.id === serviceContextMenu}
                >
                  {serviceChain.name}
                </Popover2>
              </Popover2>
            ),
            nodeData: { type: 'serviceChain', data: serviceChain },
            childNodes:
              serviceChain?.platforms?.map((platform, platformIdx) => ({
                id: platform.id,
                hasCaret: platform?.bpmnFiles?.length > 0,
                icon: 'application',
                isExpanded:
                  prevNodes
                    ?.find(node => portfolio.id === node.id)
                    ?.childNodes.find(child => child.id === serviceChain.id)
                    ?.childNodes?.find(child => child.id === platform.id)?.isExpanded ?? false,
                label: (
                  <Popover2
                    isOpen={platform.id === PlatformPopOverOpenId}
                    popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
                    content={BpmnPopOverContent}
                  >
                    <Popover2
                      content={
                        <Menu>
                          <MenuItem
                            key={Math.random() * 5000}
                            textClassName='target_menu'
                            icon='upload'
                            text='Import Bpmn File'
                            onClick={() => {
                              onPlatformMenuClick({
                                platform,
                                platformId: platform.id,
                                portfolioId: portfolio.id,
                                serviceChainId: serviceChain.id,
                                portfolioIdx,
                                serviceChainIdx,
                                platformIdx,
                              })
                              bpmnFileRef.current.click()
                            }}
                          />
                          <MenuItem
                            key={Math.random() * 5000}
                            textClassName='target_menu'
                            icon='plus'
                            text='Create New BPMN'
                            onClick={() => {
                              onPlatformMenuClick({
                                platform,
                                platformId: platform?.id,
                                portfolioId: portfolio?.id,
                                portfolioIdx,
                                serviceChainIdx,
                                serviceChainId: serviceChain.id,
                                platformIdx,
                                newFile: true,
                              })
                            }}
                          />
                        </Menu>
                      }
                      isOpen={platform?.id === platformContextMenu}
                    >
                      {platform.name}
                    </Popover2>
                  </Popover2>
                ),
                nodeData: { type: 'platform', data: platform },
                childNodes:
                  platform?.bpmnFiles?.map(bpmnFile => ({
                    id: bpmnFile?.id ?? Math.random() * 5000,
                    icon: 'document',
                    nodeData: { type: 'bpmn', data: bpmnFile },
                    secondaryLabel: (
                      <Tooltip2 content={bpmnFile.status}>
                        <Icon style={{ marginLeft: 16 }} icon={mapStatusToIcon(bpmnFile.status)} />
                      </Tooltip2>
                    ),
                    label: (
                      <Popover2
                        isOpen={bpmnFile?.id === bpmnContextMenu}
                        content={
                          <Menu>
                            <MenuItem
                              key={Math.random() * 5000}
                              textClassName='target_menu'
                              icon='upload'
                              text='commit'
                              onClick={() => {
                                setBpmnContextMenu(null)
                                onBpmnStateChange({
                                  bpmnId: bpmnFile.id,
                                  status: 'commit',
                                  platformId: platform.id,
                                  portfolioId: portfolio.id,
                                  serviceChainId: serviceChain.id,
                                })
                              }}
                            />
                            <MenuItem
                              key={Math.random() * 5000}
                              textClassName='target_menu'
                              icon='upload'
                              text='change'
                              onClick={() => {
                                setBpmnContextMenu(null)
                                onBpmnStateChange({
                                  bpmnId: bpmnFile.id,
                                  status: 'changed',
                                  platformId: platform.id,
                                  portfolioId: portfolio.id,
                                  serviceChainId: serviceChain.id,
                                })
                              }}
                            />
                            <MenuItem
                              key={Math.random() * 5000}
                              textClassName='target_menu'
                              icon='upload'
                              text='close'
                              onClick={() => {
                                setBpmnContextMenu(null)
                                onBpmnStateChange({
                                  bpmnId: bpmnFile.id,
                                  status: 'closed',
                                  platformId: platform.id,
                                  portfolioId: portfolio.id,
                                  serviceChainId: serviceChain.id,
                                })
                              }}
                            />
                            <MenuItem
                              key={Math.random() * 5000}
                              textClassName='target_menu'
                              icon='upload'
                              text='archive'
                              onClick={() => {
                                setBpmnContextMenu(null)
                                onBpmnArchive({
                                  bpmnId: bpmnFile.id,
                                  platformId: platform.id,
                                  portfolioId: portfolio.id,
                                  serviceChainId: serviceChain.id,
                                })
                              }}
                            />
                          </Menu>
                        }
                      >
                        {bpmnFile.fileName}
                      </Popover2>
                    ),
                  })) ?? [],
              })) ?? [],
          })) ?? [],
      }))
    )
  }, [
    ServiceChainPopOverContent,
    portfolioPopOverOpenId,
    onPortfolioMenuClick,
    portfolios,
    serviceChainPopOverOpenId,
    onServiceChainMenuClick,
    PlatformPopOverContent,
    setWindows,
    portfolioContextMenu,
    serviceContextMenu,
    platformContextMenu,
    addNewWindow,
    BpmnPopOverContent,
    onPlatformMenuClick,
    PlatformPopOverOpenId,
    bpmnContextMenu,
    onBpmnStateChange,
    onBpmnArchive,
  ])

  const onNodeClick = useCallback(
    (node, nodePath) => {
      if (node.nodeData.type !== 'bpmn') return

      // setNodes(setNodesAttribute(nodes, 'isSelected', false))
      // setNodes(setNodeAttribute(nodes, nodePath, 'isSelected', true))
      addNewWindow({ type: 'bpmn', data: node.nodeData.data })
    },
    [addNewWindow]
  )

  const onNodeCollapse = useCallback(
    (_, nodePath) => setNodes(setNodeAttribute(nodes, nodePath, 'isExpanded', false)),
    [nodes]
  )

  const onNodeExpand = useCallback(
    (_, nodePath) => setNodes(setNodeAttribute(nodes, nodePath, 'isExpanded', true)),
    [nodes]
  )

  return (
    <div>
      <Tree
        contents={nodes}
        onNodeClick={onNodeClick}
        onNodeCollapse={onNodeCollapse}
        onNodeExpand={onNodeExpand}
        onNodeContextMenu={onNodeContextMenu}
      />
      <input
        style={{ display: 'none' }}
        ref={bpmnFileRef}
        type='file'
        accept='.bpmn'
        multiple={false}
        onClick={event => (event.target.value = null)}
        onChange={onImportBpmnFile}
      />
    </div>
  )
}

const setNodeAttribute = (nodes, nodePath, key, value) => {
  const newNodes = cloneDeep(nodes)

  const node = Tree.nodeFromPath(nodePath, newNodes)

  node[key] = value

  return newNodes
}

const setNodesAttribute = (nodes, key, value) => {
  const newNodes = cloneDeep(nodes)

  forEachNode(nodes, node => (node[key] = value))

  return newNodes
}

const forEachNode = (nodes, callback) => {
  if (nodes === undefined) {
    return
  }

  for (const node of nodes) {
    callback(node)
    forEachNode(node.childNodes, callback)
  }
}

//work around for context menu
const useOnClickOutsideContextMenu = handler => {
  useEffect(() => {
    const listener = event => {
      if (
        event.target.classList.contains('target_menu') ||
        event.target.getAttribute('data-icon') === 'plus' ||
        event.target.getAttribute('data-icon') === 'update' ||
        event.target.tagName === 'path' ||
        event.target.classList.contains('bp3-menu-item')
      )
        return

      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [handler])
}

const mapStatusToIcon = status => {
  switch (status) {
    case 'archive':
      return 'archive'

    case 'commit':
      return 'git-commit'

    case 'changed':
      return 'changes'

    case 'closed':
      return 'lock'

    case 'draft':
      return 'draw'

    default:
      return 'draw'
  }
}
