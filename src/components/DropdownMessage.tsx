import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setNotification } from '../store/slice/chatSlice';
import { MessageSVG, PalarmSVG } from './SVG';

// import UserOne from '../images/user/user-01.png';
// import UserTwo from '../images/user/user-02.png';
// import UserThree from '../images/user/user-03.png';
// import UserFour from '../images/user/user-04.png';

const DropdownMessage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notification = useSelector((state) => state.chat.notification);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  },[]);

  const handleClick = (event) => {
    event.preventDefault();
    dispatch(setNotification(false));
    navigate('/member/chat');
  }


  return (
    <li className="relative" x-data="{ dropdownOpen: false, notifying: true }">
      <Link
        ref={trigger}
        onClick={handleClick}
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        to="#"
      >
        {
          !notification ? '' : (
            <PalarmSVG />
          )
        }

        <MessageSVG />
      </Link>

      {/* <!-- Dropdown Start --> */}
      {/* <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute -right-16 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <div className="px-4.5 py-3">
          <h5 className="text-sm font-medium text-bodydark2">Messages</h5>
        </div>

        <ul className="flex h-auto flex-col overflow-y-auto">
          <li>
            <Link
              className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              to="/messages"
            >
              <div className="h-12.5 w-12.5 rounded-full">
                <img src={UserTwo} alt="User" />
              </div>

              <div>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  Mariya Desoja
                </h6>
                <p className="text-sm">I like your confidence 💪</p>
                <p className="text-xs">2min ago</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              to="/messages"
            >
              <div className="h-12.5 w-12.5 rounded-full">
                <img src={UserOne} alt="User" />
              </div>

              <div>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  Robert Jhon
                </h6>
                <p className="text-sm">Can you share your offer?</p>
                <p className="text-xs">10min ago</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              to="/messages"
            >
              <div className="h-12.5 w-12.5 rounded-full">
                <img src={UserThree} alt="User" />
              </div>

              <div>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  Henry Dholi
                </h6>
                <p className="text-sm">I cam across your profile and...</p>
                <p className="text-xs">1day ago</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              to="/messages"
            >
              <div className="h-12.5 w-12.5 rounded-full">
                <img src={UserFour} alt="User" />
              </div>

              <div>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  Cody Fisher
                </h6>
                <p className="text-sm">I’m waiting for you response!</p>
                <p className="text-xs">5days ago</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              to="/messages"
            >
              <div className="h-12.5 w-12.5 rounded-full">
                <img src={UserTwo} alt="User" />
              </div>

              <div>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  Mariya Desoja
                </h6>
                <p className="text-sm">I like your confidence 💪</p>
                <p className="text-xs">2min ago</p>
              </div>
            </Link>
          </li>
        </ul>
      </div> */}
      {/* <!-- Dropdown End --> */}
    </li>
  );
};

export default DropdownMessage;
