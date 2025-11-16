"use client";

import HeroPanel from "@/components/HeroPanel";
import styles from "./page.module.css";
import RelicPanel from "@/components/RelicPanel";
import BattlePanel from "@/components/BattlePanel";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [battleVisible, setBattleVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const battleVisibleAction = () => {
    if (battleVisible) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
    setBattleVisible(!battleVisible);
  };

  const refreshAction = () => {
    setRefresh(!refresh);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.title}>⚔️운빨존많겜 신화 영웅 테스트</div>
        <div className={styles.inner}>
          <HeroPanel refreshAction={refreshAction} />
          <RelicPanel refresh={refresh} />
        </div>
        <div className={styles.buttonWrapper}>
          <button className={styles.openButton} onClick={battleVisibleAction}>
            인게임 오픈
          </button>
          <Link
            className={styles.linkText}
            href={"https://forms.gle/a7YLdC5V45h73DMY7"}
            target="_blank"
          >
            후기/의견 보내기
          </Link>
        </div>
        {battleVisible && <BattlePanel onClose={battleVisibleAction} />}
      </main>
    </div>
  );
}
