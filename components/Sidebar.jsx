import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useMemo } from "react";
import {
  ArticleIcon,
  CollapsIcon,
  HomeIcon,
  LogoIcon,
  LogoutIcon,
  UsersIcon,
  VideosIcon,
  MeetIcon,
} from "./icons";

const menuItems = [
  { id: 0, label: "홈", icon: UsersIcon, link: "/" },
  { id: 1, label: "회의 설정", icon: HomeIcon, link: "/crtmeet" },
  { id: 2, label: "자료 열람", icon: ArticleIcon, link: "/documents" },
  { id: 3, label: "회의 진행", icon: LogoutIcon, link: "/meeting" },
  { id: 4, label: "설정", icon: VideosIcon, link: "/setting" }
];

const Sidebar = () => {
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);

  const router = useRouter();

  const activeMenu = useMemo(
    () => menuItems.find((menu) => menu.link === router.pathname),
    [router.pathname]
  );

  const wrapperClasses = classNames(
    "h-screen px-4 pt-8 pb-4 bg-blue flex justify-between flex-col",
    {
      ["w-80"]: !toggleCollapse,
      ["w-20"]: toggleCollapse,
    }
  );

  const collapseIconClasses = classNames(
    "p-4 rounded bg-primary absolute right-0",
    {
      "rotate-180": toggleCollapse,
    }
  );


  const getNavItemClasses = (menu) => {
    return classNames(
      "flex items-center cursor-pointer hover:bg-primary rounded w-full overflow-hidden whitespace-nowrap",
      {
        ["bg-primary"]: activeMenu.id === menu.id,
      }
    );
  };

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible);
  };

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center pl-1 gap-4">
            <span
              className={classNames("mt-2 text-lg font-medium text-white", {
                hidden: toggleCollapse,
              })}
            >
              Dashboard
            </span>
          </div>
          {isCollapsible && (
            <button
              className={collapseIconClasses}
              onClick={handleSidebarToggle}
            >
              <CollapsIcon />
            </button>
          )}
        </div>

        <div className="flex flex-col items-start mt-24">
          {menuItems.map(({ icon: Icon, ...menu }) => {
            const classes = getNavItemClasses(menu);
            return (
              // eslint-disable-next-line react/jsx-key
              <div className={classes}>
                <Link href={menu.link}>
                  <a className="flex py-4 px-3 items-center w-full h-full">
                    <div style={{ width: "2.5rem" }}>
                      <Icon />
                    </div>
                    {!toggleCollapse && (
                      <span
                        className={classNames(
                          "text-md font-medium text-white"
                        )}
                      >
                        {menu.label}
                      </span>
                    )}
                  </a>
                </Link>
              </div>
            );
          })}
        </div>
      </div>



      <div className="flex items-center pl-0 gap-3 bg-light rounded-lg">
            <LogoIcon />
            <span
              className={classNames("mt-2 text-lg font-bold text-text", {
                hidden: toggleCollapse,
              })}
            >
              Meflow
            </span>
          </div>
          </div>
  );
};

export default Sidebar;



