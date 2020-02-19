import React, {useState,useRef,useEffect} from 'react'
import Input from '../input'
import Button from '../button'
import SearchDropdown from './searchDropdown'
import Popper from '../popper'
import {DataSourceItem} from './types'
import './style'

const Search = (props:SearchProps) => {
    const [dropdownShow, setdropdownShow] = useState(false)
    const searchInputContainer:any = useRef()
    const [inputVal,setinputVal] = useState('')
    const [byButtonTarget,setbyButtonTarget] = useState(false)
    const { 
        onChange,
        onSearch,
        style,
        placeholder,
        width = 240,
        prepend = null,
        OnMore,
        historyDataSource,
        dataSource
    } = props
    const closeDropdown = (e) => {
        setdropdownShow(e.target.className === 'hi-input__text ' && !byButtonTarget)
        if(e.target.className !== 'hi-icon icon-search') {
            setbyButtonTarget (false)
        }   
    }
    useEffect(()=>{
        document.addEventListener('click', closeDropdown)
        return () => {
            document.removeEventListener('click', closeDropdown)
        }
    })
    const itemClick = (value,item :DataSourceItem) => {
        setinputVal(value)
        setdropdownShow(false)
        onSearch && onSearch(value,item)
    } 
    const prefixCls = 'hi-search'
    const append = <Button type="default" icon='search' onClick={(e) => {
        setbyButtonTarget(true)
        closeDropdown(e)
        onSearch && onSearch(inputVal)
      }} />
    return (
        <div className = {prefixCls} style={style}>
            <div className = {`${prefixCls}_input`} ref={searchInputContainer}>
                <Input
                    type="text"
                    value={inputVal}
                    style={{ width }}
                    placeholder= { placeholder }
                    clearable="true"
                    append = {append}
                    prepend = {prepend}
                    onFocus = {(e)=>{
                        historyDataSource && closeDropdown(e)
                    }}
                    onChange = {(e)=>{
                        const {value} = e.target
                        setinputVal(value)
                        dataSource && value.length>0 && setdropdownShow(true)
                        onChange && onChange(value)
                    }}
                />
            </div>
            
           <Popper
                show={dropdownShow}
                attachEle={searchInputContainer.current}
                zIndex={1050}
                topGap={5}
                className={`${prefixCls}__popper`}
                placement="top-bottom-start"
                > 
                    { dataSource || historyDataSource ? <SearchDropdown  
                            prefixCls = {prefixCls} 
                            inputVal = {inputVal}
                            itemClick = {itemClick}
                            dataSource = {dataSource}
                            OnMore = {OnMore}
                            historyDataSource = {historyDataSource}
                        /> : null
                    }
            </Popper>
            
        </div>
    )
}
interface SearchProps {
    onChange ?: (param: string) => void;
    onSearch ?: (param: string,item?:DataSourceItem) => void;
    width ?: number;
    placeholder ?: string;
    loading ?: boolean;
    dataSource ?: Array<DataSourceItem>; // 如果有值就展示
    onPressEnter ?: any;
    prepend ?: JSX.Element;
    style ?: any;
    historyDataSource ?: Array<DataSourceItem>;  // 如果有值就展示；
    onDelete ?: () => void;
    OnMore ?: () => void; // 查看更多
}

export default Search