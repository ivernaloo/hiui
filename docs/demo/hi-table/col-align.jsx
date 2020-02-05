import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '@hi-ui/hi-table'

const prefix = 'col-align'
const code = `import React from 'react'
import Table from '@hi-ui/hi-table'\n
class Demo extends React.Component {
  constructor(){
    this.columns = [
      {
        title: '商品名',
        dataKey: 'name'
      },
      {
        title: '品类',
        dataKey: 'type'
      },
      {
        title: '规格',
        dataKey: 'size'
      },
      {
        title: '单价',
        dataKey: 'price',
        align: 'right'
      },
      {
        title: '门店',
        dataKey: 'address'
      },
      {
        title: '库存',
        dataKey: 'stock',
        align: 'right'
      }
    ]
    this.data = [
      {
        name: '小米9',
        type: '手机',
        size: '6G+64G 全息幻彩蓝',
        price: '3299.00',
        address: '华润五彩城店',
        stock: '29,000',
        key: 1
      },
      {
        name: '小米9 SE',
        type: '手机',
        size: '6G+64G 全息幻彩蓝',
        price: '1999.00',
        address: '清河店',
        stock: '10,000',
        key: 2
      },
      {
        name: '小米8',
        type: '手机',
        size: '6G+64G 全息幻彩蓝',
        price: '2599.00',
        address: '双安店',
        stock: '12,000',
        key: 3
      },
      {
        name: 'Redmi Note7',
        type: '手机',
        size: '6G+64G 全息幻彩蓝',
        price: '999.00',
        address: '华润五彩城店',
        stock: '140,000',
        key: 4
      },
      {
        name: '小米8 SE',
        type: '手机',
        size: '6G+64G 全息幻彩蓝',
        price: '699.00',
        address: '双安店',
        stock: '12,000',
        key: 5
      }
    ]
  }
  render () {

    return (
      <Table columns={this.columns} data={this.data} />
    )
  }
}`
const DemoApi = () => <DocViewer code={code} scope={{ Table }} prefix={prefix} />
export default DemoApi
