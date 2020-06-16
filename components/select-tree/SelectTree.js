import React from 'react'
import Tree from './tree'
import qs from 'qs'
// import NavTree from './NavTree'
import classNames from 'classnames'
import {
  getNode,
  updateCheckData,
  updateUnCheckData,
  hasChildren,
  getNodeByIdTitle
} from './tree/util'
// const PREFIX = 'hi-select-tree'
// const placeholder = '请选择'

/**
 * 将数据拉平为 pId 类数据
 * @param {*} data 原始数据
 * @param {*} defaultExpandIds 默认展开节点
 * @param {*} defaultExpandAll 是否默认展开全部节点
 * @param {*} expands 递归用展开节点数组
 * @param {*} pId  递归用 pId
 * @param {*} nArr  递归用总数据
 */
const parseData = (data, defaultExpandIds = [], defaultExpandAll = false, expands = [], pId = null, nArr = []) => {
  data.forEach(node => {
    node.pId = pId
    node.isLoaded = false
    node._origin = true
    nArr.push(node)
    if (node.children) {
      if (defaultExpandIds.includes(node.id) || defaultExpandAll) {
        expands.push(node.id)
      }
      parseData(node.children, defaultExpandIds, defaultExpandAll, expands, node.id, nArr)
    } else {
      node.isLeaf = true
    }
  })
  return {
    data: nArr,
    expands
  }
}
class SelectTree extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dropdownShow: false,
      selectedItems: [],
      showCount: 0,
      checkedNodes: {
        checked: [],
        semiChecked: []
      },
      flattenData: [],
      expandIds: []
    }
    this.selectedItemsRef = React.createRef()
  }
  handleClear () {
    this.setState({
      selectedItems: []
    })
  }
  calShowCountFlag = true
  componentDidUpdate () {
    if (this.calShowCountFlag && this.selectedItemsRef.current) {
      const sref = this.selectedItemsRef.current
      // 多选超过一行时以数字显示
      const itemsRect = sref.getBoundingClientRect()
      let width = 0
      let showCount = 0
      const items = sref.querySelectorAll('.hi-select__input--item')
      for (const item of items) {
        const itemRect = item.getBoundingClientRect()
        width += itemRect.width
        if (width + 16 < itemsRect.width) {
          ++showCount
        } else {
          break
        }
      }
      this.setState({ showCount })
      this.calShowCountFlag = false
    } else {
      this.calShowCountFlag = true
    }
  }
  /**
   * 根据 defaultCheckedIds 解析全选/半选数据
   */
  parseCheckStatusData (selectedItems) {
    const { type, defaultValue } = this.props
    const { checkedNodes, flattenData } = this.state
    if (type === 'multiple' && defaultValue) {
      let semiCheckedIds = new Set(checkedNodes.semiChecked)
      const checkedIds = new Set(checkedNodes.checked)
      semiCheckedIds.clear()
      checkedIds.clear()
      let isUpdate = false
      selectedItems.forEach(node => {
        isUpdate = true
        updateCheckData(node, flattenData, checkedIds, semiCheckedIds)
      })
      isUpdate && this.setState({
        checkedNodes: {
          checked: [...checkedIds],
          semiChecked: [...semiCheckedIds]
        }
      })
    }
  }
  parseExpandData () {
    const { defaultExpandAll, autoExpand } = this.props
    const { expandIds, checkedNodes } = this.state
    if (!defaultExpandAll && autoExpand) {
      const _expandIds = new Set([...expandIds, ...checkedNodes.checked, ...checkedNodes.semiChecked])
      console.log(_expandIds)
      this.setState({expandIds: _expandIds})
    }
  }
  /**
   * 根据 defaultValue 解析默认选中项（自动勾选）
   * defaultValue:
   * [id, ...]  |  [title, ...] | [{id: ..}] | [{id: ..., title: ...}]
   * 匹配原则： 如果值不符合 {id, title}，会优先从现有数据中匹配 id 或 title，如匹配成功，取 node 做为已选中，如无匹配 则跳过
   * 如同时包含{id, title}，从现有数据中匹配对应数据，如有，取 node 做为已选中，如无匹配，则直接使用该值，与现有数据无关联
   */
  parseDefaultSelectedItems () {
    const { defaultValue } = this.props
    const { flattenData } = this.state
    const defaultNodes = []
    if (typeof defaultValue === 'string') {
      const node = getNodeByIdTitle(defaultValue, flattenData)
      node && defaultNodes.push(node)
    } else if (defaultValue instanceof Array) {
      defaultValue.forEach(val => {
        let node
        if (typeof val !== 'object') {
          // [0, 'x']
          node = getNodeByIdTitle(val, flattenData)
        } else {
          if (val.id && val.title) {
            // [{id: '', title: ''}]
            node = getNode(val.id, flattenData) || val
          } else {
            node = getNodeByIdTitle(val.id || val.title, flattenData)
          }
        }
        if (node) {
          defaultNodes.push(node)
          // this._checkedEvents(true, node)
        }
      })
    }
    return defaultNodes
  }
  componentDidMount () {
    const { data, defaultExpandIds, defaultExpandAll } = this.props
    const result = parseData(data, defaultExpandIds, defaultExpandAll)
    this.setState({
      flattenData: result.data,
      expandIds: result.expands
    }, () => {
      const selectedItems = this.parseDefaultSelectedItems()
      this.setState({selectedItems})
      this.parseCheckStatusData(selectedItems)
    })
  }
  /**
   * 多选模式下复选框事件
   * @param {*} checked 是否被选中
   * @param {*} node 当前节点
   */
  _checkedEvents (checked, node) {
    const { onChange } = this.props
    const { checkedNodes, flattenData } = this.state
    let result = {}
    let semiCheckedIds = new Set(checkedNodes.semiChecked)
    let checkedIds = new Set(checkedNodes.checked)
    if (checked) {
      result = updateCheckData(node, flattenData, checkedIds, semiCheckedIds)
    } else {
      result = updateUnCheckData(node, flattenData, checkedIds, semiCheckedIds)
    }
    this.setState({
      checkedNodes: result
    })
    let checkedArr = []
    if (result.checked.length > 0) {
      checkedArr = result.checked.map(id => {
        return getNode(id, flattenData)
      })
    }
    this.setState({ selectedItems: checkedArr })
    onChange(result, node, checkedArr)
  }
  /**
  * 节点展开关闭事件
  * @param {*} bol 是否展开
  * @param {*} node 当前点击节点
  */
  _expandEvents (bol, node) {
    const { flattenData } = this.state
    const { onExpand, dataSource } = this.props
    const expandIds = [...this.state.expandIds]
    const hasIndex = expandIds.findIndex(id => id === node.id)
    if (hasIndex !== -1) {
      expandIds.splice(hasIndex, 1)
    } else {
      expandIds.push(node.id)
    }
    if (hasChildren(node, flattenData)) {
      // 如果包含节点，则不再拉取数据
      this.setState({
        expandIds
      })
      onExpand()
      return
    }
    const _dataSource = typeof dataSource === 'function' ? dataSource(node.id) : dataSource
    let {
      url,
      transformResponse,
      params,
      type = 'GET'
    } = _dataSource
    url = url.includes('?') ? `${url}&${qs.stringify(params)}` : `${url}?${qs.stringify(params)}`
    window.fetch(url, {
      method: type
    })
      .then(response => response.json())
      .then(res => {
        const _res = transformResponse(res)
        const nArr = _res.map(n => {
          return {
            ...n,
            isLeaf: true,
            pId: node.id
          }
        })
        this.setState({
          expandIds,
          flattenData: this.state.flattenData.concat(nArr)
        })
      })
    onExpand()
  }
  render () {
    const { clearable, data, onChange, defaultCheckedIds, defaultValue, type, dataSource } = this.props
    let { selectedItems, showCount, dropdownShow, flattenData, expandIds, checkedNodes } = this.state
    showCount =
      showCount === 0 || this.calShowCountFlag
        ? selectedItems.length
        : showCount
    return (
      <div className='hi-select-tree'>
        <div
          className={classNames(
            'hi-select-tree__input',
            type === 'multiple' ? 'multiple-values' : 'single-values',
            selectedItems.length === 0 && 'hi-select-tree__input--placeholder'
          )}
          onClick={() =>
            this.setState({ dropdownShow: !this.state.dropdownShow })}
        >
          <div className='hi-select-tree__selected' ref={this.selectedItemsRef}>
            {selectedItems.length > 0 &&
              selectedItems.slice(0, showCount).map((node, index) => {
                return (
                  <div key={index} className='hi-select__input--item'>
                    <div className='hi-select__input--item__name'>
                      {node ? node.title : ''}
                    </div>
                    {
                      type === 'multiple' && <span
                        className='hi-select__input--item__remove'
                        onClick={e => {
                          e.stopPropagation()
                          // this.props.onDelete(node)
                        }}
                      >
                        <i className='hi-icon icon-close' />
                      </span>
                    }
                  </div>
                )
              })}
            {showCount < selectedItems.length &&
              <div className='hi-select__input-items--left'>
                +
                <span className='hi-select__input-items--left-count'>
                  {selectedItems.length - showCount}
                </span>
              </div>}
          </div>

          <span className='hi-select__input--icon'>
            <i
              className={classNames(
                `hi-icon icon-${dropdownShow
                  ? 'up'
                  : 'down'} hi-select-tree__input--expand`,
                { clearable: clearable && selectedItems.length > 0 }
              )}
            />
            {clearable &&
              selectedItems.length > 0 &&
              <i
                className={`hi-icon icon-close-circle hi-select-tree__icon-close`}
                onClick={this.handleClear.bind(this)}
              />}
          </span>
        </div>
        {
          dropdownShow && <Tree
            data={flattenData}
            originData={data}
            expandIds={expandIds}
            dataSource={dataSource}
            loadDataOnExpand={false}
            defaultCheckedIds={defaultCheckedIds}
            defaultValue={defaultValue}
            checkable={type === 'multiple'}
            checkedNodes={checkedNodes}
            // searchable
            // searchMode='highlight'
            // defaultExpandIds={[]}
            // defaultExpandAll
            onExpand={this._expandEvents.bind(this)}
            onClick={node => {
              this.setState({ selectedItems: [node] })
              onChange(node.id)
            }}
            onCheck={(checked, node) => {
              this._checkedEvents(checked, node)
              // this.setState({ selectedItems: checkedArr })
              // calcShowCount()
            }}
          />
        }
        {/* <NavTree data={data} /> */}
      </div>
    )
  }
}
SelectTree.defaultProps = {
  type: 'single',
  defaultCheckedIds: [],
  defaultValue: [],
  data: [],
  clearable: true,
  onChange: () => {},
  onExpand: () => {},
  checkable: false
}
export default SelectTree