import { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { NavBar, DatePicker } from 'antd-mobile'
import './index.scss'

const Month = () => {
  const billList = useSelector((state) => state.bill.billList)
  const monthGroup = useMemo(() => {
    return _.groupBy(billList, (item) => {
      return dayjs(item.date).format('YYYY | M')
    })
  }, [billList])

  const [dateVisible, setDateVisible] = useState(false)

  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs(new Date()).format('YYYY | M')
  })

  const [currentMonthList, setCurrentMonthList] = useState(
    monthGroup[currentDate] || []
  )

  const monthResult = useMemo(() => {
    const income = currentMonthList
      .filter((item) => item.type === 'income')
      .reduce((prev, curr) => prev + curr.money, 0)
    const pay = currentMonthList
      .filter((item) => item.type === 'pay')
      .reduce((prev, curr) => prev + curr.money, 0)
    return {
      pay,
      income,
      total: pay + income,
    }
  }, [currentMonthList])

  useEffect(() => {
    const nowDate = dayjs(new Date()).format('YYYY | M')
    setCurrentMonthList(monthGroup[nowDate] || [])
  }, [monthGroup])

  const onConfirm = (date) => {
    setDateVisible(false)
    const formatDate = dayjs(date).format('YYYY | M')
    setCurrentMonthList(monthGroup[formatDate] || [])
    setCurrentDate(formatDate)
  }

  return (
    <div className='monthlyBill'>
      <NavBar
        className='nav'
        backArrow={false}
      >
        月度收支
      </NavBar>
      <div className='content'>
        <div className='header'>
          {/* 时间切换区域 */}
          <div
            className='date'
            onClick={() => setDateVisible(true)}
          >
            <span className='text'>{currentDate}月账单</span>
            <span
              className={classNames('arrow', dateVisible && 'expand')}
            ></span>
          </div>
          {/* 统计区域 */}
          <div className='twoLineOverview'>
            <div className='item'>
              <span className='money'>{monthResult.pay.toFixed(2)}</span>
              <span className='type'>支出</span>
            </div>
            <div className='item'>
              <span className='money'>{monthResult.income.toFixed(2)}</span>
              <span className='type'>收入</span>
            </div>
            <div className='item'>
              <span className='money'>{monthResult.total.toFixed(2)}</span>
              <span className='type'>结余</span>
            </div>
          </div>
          {/* 时间选择器 */}
          <DatePicker
            className='kaDate'
            title='记账日期'
            precision='month'
            visible={dateVisible}
            max={new Date()}
            onCancel={() => setDateVisible(false)}
            onConfirm={onConfirm}
            onClose={() => setDateVisible(false)}
          />
        </div>
      </div>
    </div>
  )
}

export default Month
