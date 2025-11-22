"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/TestPannel.module.css";
import { useSkillCycle } from "@/hook/useSkillCycle";
import { useInstantSkill } from "@/hook/useInstantSkill";

const DUR = 120; // 테스트 시간(초)

export default function ReaperDianTestPanel(props) {
  const {
    heroData,
    finalPower,
    finalSpeed,
    artifactStats,
    petStats,
    manaRecovery = 0,
    isBoss,
  } = props;

  //유물 효과
  const {
    artifactMagicDamage,
    artifactPhysicalDamage,
    artifactBossDamage,
    artifactSkillDamage,
    artifactCriticalDamage,
    artifactCriticalPercent,
    artifactSkillChance,
    artifactManaCallback,
  } = artifactStats;

  //펫 종합 마법/물리 피해 증가 퍼센트
  const {
    petMagicDamage,
    petPhysicalDamage,
    petDefaultDamage,
    petManaSpeed,
    petCriticalPercent,
    petCriticalDamage,
  } = petStats;

  const APS = useMemo(() => finalSpeed || 1, [finalSpeed]); // 최종 초당 공격 횟수

  const computed = useMemo(() => {
    const artifactDefaultDamage =
      heroData.type === "magic" ? artifactMagicDamage : artifactPhysicalDamage;

    const petTotalDamage =
      heroData.type === "magic" ? petMagicDamage : petPhysicalDamage;

    const bossDamage = isBoss ? artifactBossDamage : 0;

    const defaultDamage =
      finalPower *
        (1 + artifactDefaultDamage + petTotalDamage + bossDamage) *
        1 || 100;

    const critChance = 0.05 + artifactCriticalPercent + petCriticalPercent;

    const critDamage =
      2.5 +
      (heroData.type === "magic" ? artifactCriticalDamage : 0) +
      petCriticalDamage;

    const manaChargeTime =
      (heroData.skill.deathHand.manaDelay -
        heroData.skill.deathHand.manaDelay * artifactManaCallback) /
      (1 + manaRecovery + petManaSpeed);

    const manaPerSec = 100 / manaChargeTime;

    return {
      defaultDamage,
      critChance,
      critDamage,
      manaChargeTime,
      manaPerSec,
    };
  }, [
    heroData.type,
    heroData.skill.deathHand.manaDelay,
    finalPower,
    artifactStats,
    petStats,
    manaRecovery,
    petManaSpeed,
    isBoss,
  ]);

  //죽음의 손길 발동 관리
  const deathHandControl = useSkillCycle({
    manaPerSec: computed.manaPerSec,
    manaDelay: heroData.skill.deathHand.manaDelay,
    duration: heroData.skill.deathHand.duration,
    interval: 0.1,
    power: heroData.skill.deathHand.power,
    baseDamage: computed.defaultDamage,
    artifactSkillDamage,
    critChance: computed.critChance,
    critDamage: computed.critDamage,
    extraMultiplier: 1,
    setMana: (value) => setMana(value),
    usedCrit: (value) => setCritDeathHandUseTotal(value),

    onCast: () => {
      setDeathHandActive(true);
      setDeathHandUseTotal((prev) => prev + 1);
    },

    onHit: (damage, cnt) => {
      setDeathHandDamageTotal((prev) => prev + damage);
      setOneDeathHandDamage(damage);
    },

    onEnd: () => {
      setDeathHandActive(false);
    },
  });

  //테스트 상태값
  const [running, setRunning] = useState(false); //테스트 진행 상태
  const [totalDamage, setTotalDamage] = useState(0); //총 피해량
  const [defaultDamageTotal, setDefaultDamageTotal] = useState(0); //기본공격 총 피해량

  //영웅 누적 스킬 피해량
  const [relayThunderDamageTotal, setRelayThunderDamageTotal] = useState(0); //연쇄번개 총 피해량
  const [deathHandDamageTotal, setDeathHandDamageTotal] = useState(0); //죽음의 손길 총 피해량

  //영웅 누적 스킬 사용량
  const [defaultUseTotal, setDefaultUseTotal] = useState(0); //연쇄번개 총 사용횟수
  const [relayThunderUseTotal, setRelayThunderUseTotal] = useState(0); //연쇄번개 총 사용횟수
  const [deathHandUseTotal, setDeathHandUseTotal] = useState(0); //죽음의 손길 총 사용횟수

  //영웅 누적 치명타 발생량
  const [critDefaultUseTotal, setCritDefaultUseTotal] = useState(0); //기본공격 총 치명타 발생 수
  const [critRelayThunderUseTotal, setCritRelayThunderUseTotal] = useState(0); //연쇄번개 총 치명타 발생 수
  const [critDeathHandUseTotal, setCritDeathHandUseTotal] = useState(0); //죽음의 손길 총 치명타 발생 수

  //영웅 1회당 스킬 피해량
  const [oneDefaultDamage, setOneDefaultDamage] = useState(0); //기본공격 1회 피해량
  const [oneRelayThunderDamage, setOneRelayThunderDamage] = useState(0); //연쇄번개 1회 피해량
  const [oneDeathHandDamage, setOneDeathHandDamage] = useState(0); //죽음의 손길 1회 피해량

  //죽음의 손길 상태
  const [deathHandActive, setDeathHandActive] = useState(false);

  //공격한 횟수
  const [attackCount, setAttackCount] = useState(0);

  //마나 상태값
  const [mana, setMana] = useState(0); // 0~100

  //테스트 경과 시간 상태값
  const [elapsedTime, setElapsedTime] = useState(0); // 경과 시간(초)

  const relayThunderSkill = {
    ...heroData.skill.relayThunder, // 기존 값 유지
    percent:
      heroData.heroLevel >= 6
        ? 0.13 + artifactSkillChance
        : 0.08 + artifactSkillChance, // 조건부 덮어쓰기
  };

  const relayThunderAttack = useInstantSkill({
    damage: computed.defaultDamage,
    skill: relayThunderSkill,
    artifactSkillDamage,
    critChance: computed.critChance,
    critDamage: computed.critDamage,
    critUsed: () => setCritRelayThunderUseTotal((prev) => prev + 1),
  });

  useEffect(() => {
    if (!running) return;

    let attackCounter = 0;
    let total = 0;
    let defaultTotal = 0; //기본공격 데미지 누적
    let relayThunderTotal = 0; //연쇄번개 데미지 누적
    let defaultUsed = 0; //기본공격 사용 누적
    let relayThunderUsed = 0; //연쇄번개 사용 누적
    let oneDefaultDamage = 0; //1회당 기본공격 피해량
    let oneRelayThunderDamage = 0; //1회당 연쇄번개 피해량
    let critDefaultUsed = 0; //기본공격 치명타 발생 수 누적
    let critRelayThunderUsed = 0; //연쇄번개 치명타 발생 수 누적
    let attackInterval;
    let elapsedInterval; // ⏱️ 경과시간용 interval

    // ⏱️ 경과 시간 측정 시작
    setElapsedTime(0);
    const startTime = Date.now();
    elapsedInterval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(seconds);
    }, 1000);

    //사신 다이안 죽음의 손길 발동 관리
    deathHandControl.start();

    attackInterval = setInterval(() => {
      let isSkill = false;

      attackCounter += 1;
      //스킬 발동
      const relayThunderResult = relayThunderAttack.trigger();

      if (relayThunderResult > 0) {
        isSkill = true;
        total += relayThunderResult;
        relayThunderTotal += relayThunderResult;
        oneRelayThunderDamage = relayThunderResult;
        relayThunderUsed += 1;
      }

      let damage = computed.defaultDamage * (1 + petDefaultDamage) * 20;

      // 🔹 스킬이 발동하지 않은 경우 → 기본 공격
      if (!isSkill) {
        if (Math.random() < computed.critChance) {
          critDefaultUsed += 1;
          damage *= computed.critDamage;
        }

        total += damage;
        defaultTotal += damage;
        oneDefaultDamage = damage;
        defaultUsed += 1;
      }

      setTotalDamage(total);
      setAttackCount(attackCounter + deathHandUseTotal);
      setDefaultDamageTotal(defaultTotal);
      setRelayThunderDamageTotal(relayThunderTotal);
      setOneDefaultDamage(oneDefaultDamage);
      setOneRelayThunderDamage(oneRelayThunderDamage);
      setRelayThunderUseTotal(relayThunderUsed);
      setDefaultUseTotal(defaultUsed);
      //치명타 발생 수 체크
      setCritDefaultUseTotal(critDefaultUsed);
      // setCritRelayThunderUseTotal(critRelayThunderUsed);
    }, 1000 / APS);

    // 테스트 종료 타이머
    const stopTimer = setTimeout(() => {
      clearInterval(attackInterval);
      resetData();
      setRunning(false);
      setElapsedTime(DUR);
    }, DUR * 1000);

    //언마운트 또는 종료 시 정리
    return () => {
      clearInterval(attackInterval);
      clearTimeout(stopTimer);
      clearTimeout(elapsedInterval);
      deathHandControl.stop();
    };
  }, [running]);

  function formatNumber(num) {
    if (num >= 1_000_000_000) {
      // 1B 이상
      return `${Math.round(num / 1_000_000_000)}B`;
    } else if (num >= 1_000_000) {
      // 1M 이상
      return `${Math.round(num / 1_000_000)}M`;
    } else if (num >= 1_000) {
      // 1K 이상
      return `${Math.round(num / 1_000)}K`;
    } else {
      // 1K 미만
      return num;
    }
  }

  function resetData() {
    setDeathHandDamageTotal(0);
    setTotalDamage(0);
    setAttackCount(0);
    setDeathHandUseTotal(0);
    setRelayThunderUseTotal(0);
    setDefaultUseTotal(0);
    setOneDefaultDamage(0);
    setOneRelayThunderDamage(0);
    setOneDeathHandDamage(0);
    setCritDeathHandUseTotal(0);
    setCritDeathHandUseTotal(0);
    setCritRelayThunderUseTotal(0);
  }

  return (
    <>
      <div className={styles.testArea}>
        {elapsedTime >= DUR && (
          <div className={styles.finishArea}>전투 측정이 종료되었습니다.</div>
        )}
        <div className={styles.timer}>
          <div className={styles.timerItem}>
            <p className={styles.title}>전투 시간</p>
            <p className={styles.dur}>{DUR}초</p>
          </div>
          <div className={styles.timerItem}>
            <p className={styles.title}>경과 시간</p>
            <p className={styles.dur}>{elapsedTime}초</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (running) {
              setRunning(false);
              setDeathHandActive(false);
              setMana(0);
            } else {
              resetData();
              setRunning(true);
            }
          }}
          className={`${styles.controlButton} ${running ? styles.setStop : ""}`}
        >
          {running ? "전투 종료" : "전투 시작"}
        </button>
        <div className={styles.ultimateWrapper}>
          <div className={styles.title}>
            죽음의 손길 발동:
            <strong style={{ color: deathHandActive ? "#ffeb3b" : "#aaa" }}>
              {deathHandActive ? " 발동됨" : " 회복 중"}
            </strong>
          </div>
          {/* 🔋 마나 게이지 */}
          <div
            style={{
              width: "100%",
              height: "14px",
              background: "#444",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "inset 0 0 4px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                width: `${mana}%`,
                height: "100%",
                background: deathHandActive
                  ? "linear-gradient(90deg, #ffcc00, #ff8800)"
                  : "linear-gradient(90deg, #007bff, #00d4ff)",
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <div style={{ fontSize: "12px", color: "#ccc" }}>
            마나: {mana.toFixed(1)}% / 충전속도
            {(1 + manaRecovery + petManaSpeed).toFixed(2)}배 (기본:
            {heroData.skill.deathHand.manaDelay}초, 마나회복속도 적용 후:
            {computed.manaChargeTime.toFixed(2)}초)
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <div className={styles.titleWrapper}>전투측정표</div>
          <div className={styles.tableInner}>
            <ul className={styles.table}>
              <li className={styles.thead}>
                <div></div>
                <div>기본 공격</div>
                <div>{heroData.skill.relayThunder.name}</div>
                <div>{heroData.skill.deathHand.name}</div>
              </li>
              <li className={styles.tbody}>
                <div>누적 피해량</div>
                <div>{formatNumber(defaultDamageTotal)}</div>
                <div>{formatNumber(relayThunderDamageTotal)}</div>
                <div>{formatNumber(deathHandDamageTotal)}</div>
              </li>
              <li className={styles.tbody}>
                <div>발동 횟수</div>
                <div>{defaultUseTotal.toLocaleString()}</div>
                <div>{relayThunderUseTotal.toLocaleString()}</div>
                <div>{deathHandUseTotal.toLocaleString()}</div>
              </li>
              <li className={styles.tbody}>
                <div>치명타 발생</div>
                <div>{critDefaultUseTotal}</div>
                <div>{critRelayThunderUseTotal}</div>
                <div>{critDeathHandUseTotal}</div>
              </li>
              <li className={styles.tbody}>
                <div>1회 피해량</div>
                <div>{Math.floor(oneDefaultDamage).toLocaleString()}</div>
                <div>{Math.floor(oneRelayThunderDamage).toLocaleString()}</div>
                <div>{Math.floor(oneDeathHandDamage).toLocaleString()}</div>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.totalResultWrapper}>
          <div className={styles.resultBox}>
            <p className={styles.title}>⚔️ 총 피해량</p>
            <p className={styles.result}>
              {(totalDamage + deathHandDamageTotal).toLocaleString()}
            </p>
            <p className={styles.result}>
              {formatNumber(totalDamage + deathHandDamageTotal)}
            </p>
          </div>
          <div className={styles.resultBox}>
            <p className={styles.title}>🗡️ 1회 평균 피해량</p>
            <p className={styles.result}>
              {(totalDamage + deathHandDamageTotal) / attackCount
                ? (
                    (totalDamage + deathHandDamageTotal) /
                    attackCount
                  ).toLocaleString()
                : 0}
            </p>
          </div>
          <div className={styles.resultBox}>
            <p className={styles.title}>🍃 총 공격횟수</p>
            <p className={styles.result}>{attackCount}</p>
          </div>
        </div>
      </div>
    </>
  );
}
