import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faNoteSticky,
  faHouseChimney,
} from "@fortawesome/free-solid-svg-icons";
import { useRoom } from "@/context/RoomContext";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import placeholderSVG from "@/assets/placeholder.svg";
import React from "react"
import Skeleton from "./Skeleton";

export default function RoomList() {
  const { user } = useAuth();
  const { setTab, pms } = useRoom();

  const router = useRouter();
  const pathname = usePathname();

  return (
    <ul className="rooms-wrapper">
      <div className="header">
        <span>
          <b>Private Messages</b>
        </span>
      </div>
      <div className="rooms-container">
        <li
          className={pathname == "/" ? "active" : ""}
          onClick={() => {
            setTab("home");
            router.push("/");
          }}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faHouseChimney} />
          </span>
          <span className="content">Home</span>
        </li>
        <li
          className={pathname == "/friends" ? "active" : ""}
          onClick={() => {
            setTab("friends");
            router.push("/friends");
          }}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faUserGroup} />
          </span>
          <span className="content">Friends</span>
        </li>
        <li
          className={pathname == "/notes" ? "active" : ""}
          onClick={() => {
            setTab("notes");
            router.push("/notes");
          }}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faNoteSticky} />
          </span>
          <span className="content">Notes</span>
        </li>
        <span className="convo-title">Conversations</span>
        <ul className="rooms">
          {pms.length == 0 && (
            <div className="flex flex-col gap-2 w-full items-center pt-[10px]">
              <Skeleton className="w-[calc(100%-12px)] h-[51px] rounded-[4px]">
                <div className="flex items-center w-full h-full px-4 gap-4">
                  <Skeleton className="w-[35px] h-[35px] bg-[var(--skeleton-background-secondary)] rounded-full" />
                  <Skeleton className="w-[calc(100%-51px)] h-[35px] bg-[var(--skeleton-background-secondary)] rounded-[4px]" />
                </div>
              </Skeleton>
              <Skeleton className="w-[calc(100%-12px)] h-[51px] rounded-[4px]">
                <div className="flex items-center w-full h-full px-4 gap-4 opacity-30">
                  <Skeleton className="w-[35px] h-[35px] bg-[var(--skeleton-background-secondary)] rounded-full" />
                  <Skeleton className="w-[calc(100%-51px)] h-[35px] bg-[var(--skeleton-background-secondary)] rounded-[4px]" />
                </div>
              </Skeleton>
              <Skeleton className="w-[calc(100%-12px)] h-[51px] rounded-[4px]">
                <div className="flex items-center w-full h-full px-4 gap-4 opacity-20">
                  <Skeleton className="w-[35px] h-[35px] bg-[var(--skeleton-background-secondary)] rounded-full" />
                  <Skeleton className="w-[calc(100%-51px)] h-[35px] bg-[var(--skeleton-background-secondary)] rounded-[4px]" />
                </div>
              </Skeleton>
            </div>
          )
        }
          {pms.map((pm, key) => {
            switch (pm.type) {
              case 0:
                const currentUser = pm.recipients?.find(
                  (recipient) => recipient.id != user.id
                );
                return (
                  <li className="pm" onClick={() => router.push(`/rooms/${pm.id}`)} key={key}>
                    <div className="relative">
                      <Image
                        className="avatar"
                        src={`${process.env.NEXT_PUBLIC_CDN}/avatars/${currentUser?.avatar}.png`}
                        width={35}
                        height={35}
                        alt="profile"
                      />
                      {currentUser?.presence.online === true ? <div
                        className={`absolute bottom-0 right-0 mr-[-2.25px] mb-[-2.25px] border-[2.75px] border-[#1f1f1f] rounded-full w-[16px] h-[16px] status-${currentUser?.presence.status}`}
                      /> : <div className={`absolute bottom-0 mr-[-2.25px] mb-[-2.25px] right-0 border-[2.75px] border-[#1f1f1f] w-[16px] h-[16px] status-offline rounded-full`}></div>
                      }
                    </div>
                    <span className="content">
                      <span className="username">{currentUser?.username}</span>
                      <span className="status-text text-gray-400">
                        {
                          currentUser?.presence.online
                            ? currentUser?.presence.status_text && currentUser?.presence.status_text.trim() !== ''
                              ? currentUser?.presence.status_text
                              : currentUser?.presence.status.charAt(0).toUpperCase() +
                              currentUser?.presence.status.slice(1)
                            : "Offline"
                        }
                      </span>
                    </span>
                  </li>
                );
            }
          })}
        </ul>
      </div>
    </ul>
  );
}
