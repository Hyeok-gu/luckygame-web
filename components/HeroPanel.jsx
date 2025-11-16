"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/HeroPanel.module.css";
import SectionTitle from "./ui/SectionTitle";
import { heroList, heroStat } from "@/util/heroStat";
import HeroSkills from "./ui/HeroSkills";
import haily from "@/public/images/hero/haily.webp";
import awackHaily from "@/public/images/hero/awackHaily.webp";
import Image from "next/image";

const heroProfile = { haily, awackHaily };

export default function HeroPanel({ refreshAction }) {
  const [selectedHero, setSelecteHero] = useState(heroList[0]);
  const [selectedHeroLevel, setSelectedHeroLevel] = useState(1); //선택한 신화 레벨
  const [heroListVisible, setHeroListVisible] = useState(false);

  //값이 변경될 때마다, 로컬스토리지에 신화 정보 저장.
  useEffect(() => {
    const heroInfo = {
      enName: selectedHero.value,
      name: selectedHero.label,
      gender: heroStat[selectedHero.value].gender,
      type: heroStat[selectedHero.value].type,
      skill: heroStat[selectedHero.value].skill,
      heroLevel: selectedHeroLevel,
      defaultPower:
        heroStat[selectedHero.value].levelStat[selectedHeroLevel - 1]
          .defaultPower,
      defaultSpeed:
        heroStat[selectedHero.value].levelStat[selectedHeroLevel - 1]
          .defaultSpeed,
    };

    localStorage.setItem("heroData", JSON.stringify(heroInfo));
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

  console.log(
    "heroProfile[selectedHero?.value]",
    heroProfile[selectedHero?.value]
  );

  return (
    <>
      <div className={styles.panel}>
        <SectionTitle title="신화 영웅" description="신화 영웅을 선택하세요" />
        <div className={styles.heroBox}>
          <div className={styles.heroImage}>
            {selectedHero?.value && (
              <Image
                className={styles.heroImageSrc}
                src={heroProfile[selectedHero?.value]}
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
                <label>Lv.</label>
                <select
                  value={selectedHeroLevel}
                  onChange={(e) => {
                    console.log(e.target.value);
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
                      heroStat[selectedHero.value]?.levelStat?.[level - 1]
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
                      heroStat[selectedHero.value]?.levelStat?.[level - 1]
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
                  {heroList.map((item) => {
                    const isActive = item.value === selectedHero.value;
                    return (
                      <li
                        className={isActive ? styles.selected : ""}
                        key={item.value}
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
        <HeroSkills hero={selectedHero.value} heroLevel={selectedHeroLevel} />
        <div className={styles.effectArea}>
          {heroStat[selectedHero.value].levelEffect.map((item, index) => {
            const disabled = item.level > selectedHeroLevel;
            return (
              <div
                className={`${styles.effectDescItem} ${
                  disabled ? styles.disabled : ""
                }`}
                key={index}
              >
                <span>Lv.{item.level}</span>
                <p className={styles.effectDescription}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
