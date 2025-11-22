"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/HeroPanel.module.css";
import SectionTitle from "./ui/SectionTitle";
import { heroList, heroStat } from "@/util/heroStat";
import HeroSkills from "./ui/HeroSkills";
import haily from "@/public/images/hero/haily.webp";
import awackHaily from "@/public/images/hero/awackHaily.webp";
import reaperDian from "@/public/images/hero/reaperDian.webp";
import Image from "next/image";

const heroProfile = { haily, awackHaily, reaperDian };

export default function HeroPanel({ refreshAction }) {
  const [loading, setLoading] = useState(true);
  const [selectedHero, setSelecteHero] = useState(heroList[0]);
  const [selectedHeroLevel, setSelectedHeroLevel] = useState(1); //선택한 신화 레벨
  const [heroListVisible, setHeroListVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      const loadedHeroInfoString =
        localStorage.getItem("savedHeroData") || null;
      const loadedHeroInfo = loadedHeroInfoString
        ? JSON.parse(loadedHeroInfoString)
        : null;

      if (!loadedHeroInfo?.enName) {
        return;
      } else {
        setSelecteHero(loadedHeroInfo);
        setSelectedHeroLevel(loadedHeroInfo.heroLevel);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  //값이 변경될 때마다, 로컬스토리지에 신화 정보 저장.
  useEffect(() => {
    const heroInfo = {
      enName: selectedHero.enName,
      name: selectedHero.label,
      value: selectedHero.enName,
      label: selectedHero.label,
      gender: selectedHero.gender,
      type: selectedHero.type,
      skill: heroStat[selectedHero.enName].skill,
      heroLevel: selectedHeroLevel,
      defaultPower:
        heroStat[selectedHero.enName]?.levelStat[selectedHeroLevel - 1]
          .defaultPower,
      defaultSpeed:
        heroStat[selectedHero.enName]?.levelStat[selectedHeroLevel - 1]
          .defaultSpeed,
    };
    localStorage.setItem("heroData", JSON.stringify(heroInfo));
    localStorage.setItem("savedHeroData", JSON.stringify(heroInfo));
    refreshAction();
  }, [selectedHero, selectedHeroLevel]);

  //히어로 리스트 오픈
  const openHeroList = () => {
    setHeroListVisible(!heroListVisible);
  };

  //히어로 선택

  const selectHeroAction = (item) => {
    setHeroListVisible(false);
    setSelecteHero(item);
    refreshAction();
  };

  return (
    <>
      <div className={styles.panel}>
        <SectionTitle title="신화 영웅" description="신화 영웅을 선택하세요" />
        {!loading ? (
          <>
            <div className={styles.heroBox}>
              <div className={styles.heroImage}>
                {selectedHero?.enName && (
                  <Image
                    className={styles.heroImageSrc}
                    src={heroProfile[selectedHero?.enName]}
                    alt="신화 영웅 이미지"
                    fill
                  />
                )}
              </div>
              <div className={styles.heroInfo}>
                <p className={styles.heroName}>{selectedHero.label}</p>
                <div className={styles.statsBox}>
                  <span className={styles.indexTitle}>신화 레벨선택</span>
                  <div className={styles.level}>
                    <label htmlFor="heroLevelSelect">Lv.</label>
                    <select
                      id="heroLevelSelect"
                      name="heroLevelSelect"
                      value={selectedHeroLevel}
                      onChange={(e) => {
                        setSelectedHeroLevel(e.target.value);
                      }}
                    >
                      {Array.from({ length: 15 }, (_, i) => {
                        const level = i + 1; // 1부터 시작
                        return (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className={styles.statsArea}>
                  <div className={styles.statsBox}>
                    <span className={styles.indexTitle}>기본 공격력</span>
                    <span className={styles.value}>
                      {(() => {
                        const level = parseInt(selectedHeroLevel, 10);
                        const basePower =
                          heroStat[selectedHero.enName]?.levelStat?.[level - 1]
                            ?.defaultPower ?? 0;

                        return Math.round(basePower).toLocaleString(); // 정수로 반올림 후 쉼표
                      })()}
                    </span>
                  </div>
                  <div className={styles.statsBox}>
                    <span className={styles.indexTitle}>공격속도</span>
                    <span className={styles.value}>
                      {(() => {
                        const level = parseInt(selectedHeroLevel, 10);
                        const baseSpeed =
                          heroStat[selectedHero.enName]?.levelStat?.[level - 1]
                            ?.defaultSpeed ?? 0;

                        return baseSpeed; // 정수로 반올림 후 쉼표
                      })()}
                    </span>
                  </div>
                </div>
                <div className={styles.changeArea}>
                  <button className={styles.changeBtn} onClick={openHeroList}>
                    영웅변경
                  </button>
                  {heroListVisible && (
                    <ul className={styles.heroList}>
                      {heroList.map((item, index) => {
                        const isActive = item.enName === selectedHero.enName;
                        return (
                          <li
                            className={isActive ? styles.selected : ""}
                            key={index}
                          >
                            <button onClick={() => selectHeroAction(item)}>
                              {item.label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <HeroSkills
              hero={selectedHero.enName}
              heroLevel={selectedHeroLevel}
            />
            <div className={styles.effectArea}>
              {selectedHero.enName && (
                <>
                  {heroStat[selectedHero.enName]?.levelEffect?.map(
                    (item, index) => {
                      const disabled = item.level > selectedHeroLevel;
                      return (
                        <div
                          className={`${styles.effectDescItem} ${
                            disabled ? styles.disabled : ""
                          }`}
                          key={index}
                        >
                          <span>Lv.{item.level}</span>
                          <p className={styles.effectDescription}>
                            {item.desc}
                          </p>
                        </div>
                      );
                    }
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <div className={styles.heroBox}>
            <span>영웅 정보를 불러오고 있습니다.</span>
          </div>
        )}
      </div>
    </>
  );
}
