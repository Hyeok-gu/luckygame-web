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

  // const saveInfo = () => {
  //   const loadedHeroInfoString = localStorage.getItem("heroData") || null;
  //   const loadedPetStatsString = localStorage.getItem("petStats") || null;
  //   const loadedArtifactStatsString =
  //     localStorage.getItem("artifactStats") || null;
  //   const loadedTresureStatsString =
  //     localStorage.getItem("tresureStats") || null;

  //   const loadedHeroInfo = loadedHeroInfoString
  //     ? JSON.parse(loadedHeroInfoString)
  //     : null;
  //   const loadedPetStats = loadedPetStatsString
  //     ? JSON.parse(loadedPetStatsString)
  //     : null;
  //   const loadedArtifactStats = loadedArtifactStatsString
  //     ? JSON.parse(loadedArtifactStatsString)
  //     : null;
  //   const loadedTresureStats = loadedTresureStatsString
  //     ? JSON.parse(loadedTresureStatsString)
  //     : null;

  //   localStorage.setItem("savedHeroData", JSON.stringify(loadedHeroInfo));
  //   localStorage.setItem("savedPetStats", JSON.stringify(loadedPetStats));
  //   localStorage.setItem(
  //     "savedArtifactStats",
  //     JSON.stringify(loadedArtifactStats)
  //   );
  //   localStorage.setItem(
  //     "savedTresureStats",
  //     JSON.stringify(loadedTresureStats)
  //   );

  //   alert("저장했습니다.");
  // };

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
          {/* <button className={styles.linkText} onClick={saveInfo}>
            영웅 및 유물 정보 저장
          </button> */}
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
