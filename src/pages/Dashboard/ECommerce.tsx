import CardFour from '../../components/CardFour.tsx';
import CardOne from '../../components/CardOne.tsx';
import CardThree from '../../components/CardThree.tsx';
import CardTwo from '../../components/CardTwo.tsx';
import ChartOne from '../../components/ChartOne.tsx';
import ChartThree from '../../components/ChartThree.tsx';
import ChartFour from '../../components/ChartFour.tsx';

import ChartTwo from '../../components/ChartTwo.tsx';
import ChatCard from '../../components/ChatCard.tsx';
import MapOne from '../../components/MapOne.tsx';
import TableOne from '../../components/TableOne.tsx';

import { useEffect, useState } from 'react';
import { setLogout } from '../../utils/index.js';
import { getRoleInfo } from '../../utils/index';
import { isEmpty } from '../../config/index.js';

const ECommerce = () => {

  const [dashcontent_flag, setDashContentFlag] = useState(false);
  let role_id = window.localStorage.getItem('role_id');
  const setDash = () => {
    let role_id = window.localStorage.getItem('role_id');
    let dcontent = { role: 'dashboard_content', roleid: role_id };
    getRoleInfo(dcontent)
      .then(result => {
        setDashContentFlag(result);
      })
      .catch(err => {
        setLogout();
      })
  }

  if (isEmpty(role_id)) {
    console.log("--------111111-----")
    setTimeout(() => {
      setDash();
    }, 450);
  } else {
    console.log("---------22222222------")
    setDash();
  }

  return (
    <>
      {dashcontent_flag ?
        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            <CardOne />
            <CardTwo />
            <CardThree />
            <CardFour />
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
            <ChartOne />
            <ChartTwo />
            <ChartThree />
            <MapOne />
            <div className="col-span-12 xl:col-span-8">
              <TableOne />
            </div>
            <ChatCard />
          </div>
        </div>
        :
        <div>
          <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
            <ChartTwo />
            <MapOne />

          </div>
        </div>
      }
    </>
  );
};

export default ECommerce;
