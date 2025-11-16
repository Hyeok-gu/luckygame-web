"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/BattlePanel.module.css";
import SectionTitle from "./ui/SectionTitle";
import HailyTestPanel from "./HailyTestPanel";
import Note from "./Note";
import haily from "@/public/images/hero/haily.webp";
import awackHaily from "@/public/images/hero/awackHaily.webp";
import Image from "next/image";
import AwackHailyTestPanel from "./AwackHailyTestPanel";

const heroProfile = { haily, awackHaily };

const HERO_BLOP_POWER = 0; //정수
const HERO_BEIN_FINAL_POWER = 0.0; //베인 최후 스킬 퍼센트
const HERO_TIGER_POWER = 0.0; //호랑이사부 공격력 증가 퍼센트
const HERO_DRAGON_POWER = 0.0; //드래곤 공격력 증가 퍼센트
const HERO_BATMAN_POWER = 0.0; //배트맨 공격력 증가 퍼센트
const HERO_ROKA_POWER = 0.0; //로카 공격력 증가 퍼센트
const PET_CUSTOM_POWER = 0.221; //펫 개별 능력치 공격력 증가 퍼센트
// const PET_CUSTOM_POWER = 0; //펫 개별 능력치 공격력 증가 퍼센트

export default function BattlePanel(props) {
  const { onClose } = props;
  const [noteVisible, setNoteVisible] = useState(false); //개발자 노트 모달 상태
  const [heroData, setHeroData] = useState({}); //신화 정보
  const [petStats, setPetStats] = useState({}); //펫 정보
  const [heroStats, setHeroStats] = useState({}); //영웅종합버프 정보
  const [artifactStats, setArtifactStats] = useState({}); //유물 정보
  const [tresureStats, setTresureStats] = useState({}); //신화보물 정보
  const [inGamePowerLevel, setInGamePowerLevel] = useState(1); //인게임 신화강화 레벨
  const [inGameDefenseLevel, setInGameDefenseLevel] = useState(180); //인게임 방어력 감소
  const [gold, setGold] = useState(0); //보유중인 골드량
  const [goldString, setGoldString] = useState(0); //보유중인 골드량 string
  const [finalPower, setFinalPower] = useState(0); //최종 공격력 데이터
  const [isUltimate, setIsUltimate] = useState(false); //현재 헤일리 초신성 상태로 사용 중.
  const [manaRecovery, setManaRecovery] = useState(0); //마나 회복 속도
  const [otherPower, setOtherPower] = useState(0); //모아공 공격력%
  const [otherSpeed, setOtherSpeed] = useState(0); //모아공 공격속도%
  const [isBoss, setIsBoss] = useState(false); //보스 공격 On상태
  const [sameTarget, setSameTarget] = useState(false); //같은 대상 공격 상태
  const [otherHeroLength, setOtherHeroLength] = useState(0); //다른 신화 종류 수

  //로컬스토리지에 저장된 신화 정보 가져오기
  useEffect(() => {
    getStorageDatas();
  }, []);

  useEffect(() => {
    finalPowerReturn();
  }, [
    heroData,
    petStats,
    heroStats,
    artifactStats,
    tresureStats,
    inGamePowerLevel,
    gold,
    isUltimate,
    manaRecovery,
    otherPower,
    otherSpeed,
  ]);

  //로컬스토리지에 있는 string 데이터를 json데이터로 변경
  const parseDataAction = (string) => {
    const result = JSON.parse(string);
    if (!result) {
      return null;
    }
    return result;
  };

  //스토리지 정보 가져오기
  const getStorageDatas = () => {
    setHeroData(parseDataAction(localStorage.getItem("heroData")));
    setPetStats(parseDataAction(localStorage.getItem("petStats")));
    setHeroStats(parseDataAction(localStorage.getItem("heroStats")));
    setArtifactStats(parseDataAction(localStorage.getItem("artifactStats")));
    setTresureStats(parseDataAction(localStorage.getItem("tresureStats")));
  };

  //최종 공격력 리턴
  const finalPowerReturn = () => {
    const inGameLevel = 0.5 * (1 + inGamePowerLevel); //인게임 강화
    const heroStatsPer = heroStats / 100; //영웅 종합 공격력 증가 퍼센트
    const moneyGunPercent =
      ((artifactStats.artifactCoinPower / 100) * gold) / 100; //머니건 효과

    const baseAndBlopPower = heroData.defaultPower + HERO_BLOP_POWER; //블롭 및 기본 공격력
    const powerPotion = artifactStats.artifactPower * 2; //힘의물약
    const petHeroTotal = PET_CUSTOM_POWER + petStats.petPower + heroStatsPer;
    const powerMultiplier =
      1 + powerPotion + HERO_BEIN_FINAL_POWER + petHeroTotal;
    const tigerBonus = heroData.defaultPower * HERO_TIGER_POWER;
    const otherPowerPer = otherPower / 100;

    //헤일리 별의 힘 증가량 퍼센트
    const hailyPower =
      heroData.enName === "haily" ? (heroData.heroLevel >= 6 ? 40 : 20) : 0;
    //헤일리 초신성 상태일 때의 별의 힘 증가량 50% 증가, 별의 힘 없는 상태에서도 50% 증가됨
    const awackHailyPower = heroData.enName === "awackHaily" ? 20 : 0; //각성 헤일리 기본 2000% 공격력 증가.

    const hailyFinarPower = isUltimate ? hailyPower * 1.5 : hailyPower;
    const result =
      inGameLevel *
      (baseAndBlopPower * powerMultiplier + tigerBonus) *
      (1 +
        moneyGunPercent +
        otherPowerPer +
        HERO_DRAGON_POWER +
        HERO_BATMAN_POWER +
        HERO_ROKA_POWER +
        hailyFinarPower +
        awackHailyPower);

    setFinalPower(Math.round(result - heroData.defaultPower));
  };

  return (
    <>
      <section className={styles.battleModal}>
        <button onClick={onClose} className={styles.closeButton}>
          닫기
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="40px"
            viewBox="0 -960 960 960"
            width="40px"
            fill="#cccccc"
          >
            <path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z" />
          </svg>
        </button>
        <div className={styles.panel}>
          <div className={styles.titleWrapper}>
            <SectionTitle
              title="인게임"
              description="아래는 전투 시 활동하는 설정값입니다."
            />
            <div className={styles.controlBtnWrapper}>
              <button
                onClick={() => {
                  setNoteVisible(true);
                }}
                className={styles.controlButton}
                title="개발자 노트"
              >
                <span>개발자 노트입니다.</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#cccccc"
                >
                  <path d="M424-320q0-81 14.5-116.5T500-514q41-36 62.5-62.5T584-637q0-41-27.5-68T480-732q-51 0-77.5 31T365-638l-103-44q21-64 77-111t141-47q105 0 161.5 58.5T698-641q0 50-21.5 85.5T609-475q-49 47-59.5 71.5T539-320H424Zm56 240q-33 0-56.5-23.5T400-160q0-33 23.5-56.5T480-240q33 0 56.5 23.5T560-160q0 33-23.5 56.5T480-80Z" />
                </svg>
              </button>
            </div>
          </div>
          {heroData.enName === "haily" && (
            <div className={styles.noticeArea}>
              헤일리의 경우 별의 힘 획득 수가 10으로 고정됩니다. 1~5레벨 200%
              증가, 6~15레벨 400% 증가
            </div>
          )}
          <div className={styles.inner}>
            <div className={styles.profileArea}>
              <div className={styles.profileImage}>
                <Image
                  className={styles.profileImageSrc}
                  src={heroProfile[heroData.enName]}
                  alt="신화영웅 이미지"
                  fill
                />
                <p className={styles.profileLevel}>Lv.{heroData.heroLevel}</p>
                <p className={styles.profileName}>{heroData.name}</p>
              </div>
              <div className={styles.specArea}>
                <div className={styles.statsBox}>
                  <span className={styles.indexTitle}>최종 공격력</span>
                  <div className={styles.valueWrapper}>
                    <span className={`${styles.value} ${styles.desc}`}>
                      {heroData.defaultPower || "-"}
                    </span>
                    <span className={styles.plusValue}>
                      +{finalPower.toLocaleString() || "-"}
                    </span>
                  </div>
                </div>
                <div className={styles.statsBox}>
                  <span className={styles.indexTitle}>최종 공격속도</span>
                  <div className={styles.valueWrapper}>
                    <span className={`${styles.value} ${styles.desc}`}>
                      {heroData.defaultSpeed || "-"}
                    </span>
                    <span className={styles.plusValue}>
                      +
                      {(
                        heroData.defaultSpeed *
                          (1 +
                            artifactStats.artifactSpeed * 2 +
                            otherSpeed / 100) -
                        heroData.defaultSpeed
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.enforceArea}>
              <div className={styles.statsBox}>
                <span className={styles.indexTitle}>전설~불멸 강화</span>
                <input
                  className={`${styles.value} ${styles.input}`}
                  type="number"
                  name="inGamePowerLevel"
                  placeholder="강화 레벨 입력"
                  value={inGamePowerLevel}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value === null || value === 0 || value === "") {
                      alert("최소 강화 레벨은 1 이상이어야 합니다.");
                      setInGamePowerLevel(1);
                    } else {
                      setInGamePowerLevel(value);
                    }
                  }}
                />
              </div>
              <div className={styles.statsBox}>
                <span className={styles.indexTitle}>적 방어력 감소</span>
                <input
                  className={`${styles.value} ${styles.input}`}
                  type="number"
                  placeholder="감소 수치 입력"
                  value={inGameDefenseLevel}
                  onChange={(e) => {
                    setInGameDefenseLevel(e.target.value);
                  }}
                />
              </div>
              <div className={styles.statsBox}>
                <span className={styles.indexTitle}>골드량</span>
                <input
                  className={`${styles.value} ${styles.input}`}
                  type="text" // ← number → text 로 변경!
                  placeholder="골드량 입력"
                  value={goldString}
                  onChange={(e) => {
                    // 숫자 외 문자 제거
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    const number = Number(numericValue);
                    setGold(number);
                    setGoldString(number.toLocaleString()); // 자동 쉼표 표시
                  }}
                />
                <span className={styles.subDesc}>
                  머니건 효과:
                  {Math.floor(artifactStats.artifactCoinPower * gold) / 100}%
                </span>
              </div>
            </div>
            <div className={styles.enforceArea}>
              <div className={styles.statsBox}>
                <span className={styles.indexTitle}>마나회복%</span>
                <input
                  className={`${styles.value} ${styles.input}`}
                  type="number"
                  placeholder="마나회복% 입력"
                  value={manaRecovery}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setManaRecovery(value);
                  }}
                />
              </div>
              <div className={styles.statsBox}>
                <span className={styles.indexTitle}>공격력%</span>
                <input
                  className={`${styles.value} ${styles.input}`}
                  type="number"
                  placeholder="공격력% 입력"
                  value={otherPower}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setOtherPower(value);
                  }}
                />
              </div>
              <div className={styles.statsBox}>
                <span className={styles.indexTitle}>공격속도%</span>
                <input
                  className={`${styles.value} ${styles.input}`}
                  type="number"
                  placeholder="공격속도% 입력"
                  value={otherSpeed}
                  onChange={(e) => {
                    setOtherSpeed(e.target.value);
                  }}
                />
              </div>
              <div className={styles.statsBox}>
                <span className={styles.indexTitle}>다른 종류 신화 수</span>
                <input
                  className={`${styles.value} ${styles.input}`}
                  type="number"
                  placeholder="신화 종류 입력"
                  value={otherHeroLength}
                  onChange={(e) => {
                    setOtherHeroLength(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className={styles.optionsWrapper}>
              <button
                className={`${styles.optionButton} ${isBoss ? styles.on : ""}`}
                onClick={() => setIsBoss(!isBoss)}
                title="활성화 시 대검 유물 효과가 적용됩니다."
              >
                보스공격 {isBoss ? "ON" : "OFF"}
              </button>
              <button
                className={`${styles.optionButton} ${
                  sameTarget ? styles.on : ""
                }`}
                onClick={() => setSameTarget(!sameTarget)}
                title="같은 대상을 공격할지 선택합니다."
              >
                같은 대상 공격 {sameTarget ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>
        {heroData.enName === "haily" && (
          <HailyTestPanel
            finalPower={finalPower + heroData.defaultPower}
            finalSpeed={
              heroData.defaultSpeed *
              (1 + artifactStats.artifactSpeed * 2 + otherSpeed / 100)
            }
            heroData={heroData}
            tresureStats={tresureStats}
            artifactStats={artifactStats}
            petStats={petStats}
            manaRecovery={!manaRecovery ? 0 : Number(manaRecovery / 100)}
            setUltimateActive={setIsUltimate}
            isBoss={isBoss}
          />
        )}
        {heroData.enName === "awackHaily" && (
          <AwackHailyTestPanel
            finalPower={finalPower + heroData.defaultPower}
            finalSpeed={
              heroData.defaultSpeed *
              (1 + artifactStats.artifactSpeed * 2 + otherSpeed / 100)
            }
            heroData={heroData}
            tresureStats={tresureStats}
            artifactStats={artifactStats}
            petStats={petStats}
            manaRecovery={!manaRecovery ? 0 : Number(manaRecovery / 100)}
            setUltimateActive={setIsUltimate}
            isBoss={isBoss}
            sameTarget={sameTarget}
            otherHeroLength={otherHeroLength * 0.05}
          />
        )}
      </section>
      {noteVisible && <Note onClose={() => setNoteVisible(false)} />}
    </>
  );
}
