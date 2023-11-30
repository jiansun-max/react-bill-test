import { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import _ from "lodash";
import { NavBar, DatePicker } from "antd-mobile";
import "./index.scss";
import DailyBill from "./components/DayBill";

const Month = () => {
  const billList = useSelector((state) => state.bill.billList);
  // console.log(billList,'----billList')
  const monthGroup = useMemo(() => {
    return _.groupBy(billList, (item) => {
      return dayjs(item.date).format("YYYY-M");
    });
  }, [billList]);
  console.log(monthGroup,'---monthGroup')

  const [dateVisible, setDateVisible] = useState(false);

  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs(new Date()).format("YYYY-M");
  });

  const [currentMonthList, setCurrentMonthList] = useState(
    monthGroup[currentDate] || []
  );

  const monthResult = useMemo(() => {
    const income = currentMonthList
      .filter((item) => item.type === "income")
      .reduce((prev, curr) => prev + curr.money, 0);
    const pay = currentMonthList
      .filter((item) => item.type === "pay")
      .reduce((prev, curr) => prev + curr.money, 0);
    return {
      pay,
      income,
      total: pay + income,
    };
  }, [currentMonthList]);

  useEffect(() => {
    const nowDate = dayjs(new Date()).format("YYYY-M");
    setCurrentMonthList(monthGroup[nowDate] || []);
  }, [monthGroup]);

  const onConfirm = (date) => {
    setDateVisible(false);
    const formatDate = dayjs(date).format("YYYY-M");
    setCurrentMonthList(monthGroup[formatDate] || []);
    setCurrentDate(formatDate);
  };

  const dayGroup = useMemo(() => {
    console.log('----currentMonthList',currentMonthList)
    const groupData = _.groupBy(currentMonthList, (item) => {
      return dayjs(item.date).format("YYYY年MM月DD日");
    });
    const keys = Object.keys(groupData);
    return {
      groupData,
      keys,
    };
  }, [currentMonthList]);

  return (
    <div className="monthlyBill">
      <NavBar className="nav" backArrow={false}>
        月度收支
      </NavBar>
      <div className="content">


        <div className="header">
          {/* 时间切换区域 */}
          <div className="date" onClick={() => setDateVisible(true)}>
            <span className="text">{currentDate}月账单</span>
            <span
              className={classNames("arrow", dateVisible && "expand")}
            ></span>
          </div>
          {/* 统计区域 */}
          <div className="twoLineOverview">
            <div className="item">
              <span className="money">{monthResult.pay.toFixed(2)}</span>
              <span className="type">支出</span>
            </div>
            <div className="item">
              <span className="money">{monthResult.income.toFixed(2)}</span>
              <span className="type">收入</span>
            </div>
            <div className="item">
              <span className="money">{monthResult.total.toFixed(2)}</span>
              <span className="type">结余</span>
            </div>
          </div>
          {/* 时间选择器 */}
          <DatePicker
            className="kaDate"
            title="记账日期"
            precision="month"
            visible={dateVisible}
            max={new Date()}
            onCancel={() => setDateVisible(false)}
            onConfirm={onConfirm}
            onClose={() => setDateVisible(false)}
          />
        </div>


        {dayGroup.keys.map((key) => (
          <DailyBill key={key} billList={dayGroup.groupData[key]} date={key} />
        ))}
      </div>
    </div>
  );
};

export default Month;
