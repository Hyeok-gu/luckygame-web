"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/TestPannel.module.css";

export default function HailyTestPanel({
  heroData,
  finalPower,
  finalSpeed,
  tresureStats,
  artifactStats,
  petStats,
  manaRecovery = 0,
  setUltimateActive,
  isBoss,
}) {
  const petDefaultDamage = petStats.petDefaultDamage || 0; //펫 종합 효과 기본공격 피해
  const petManaSpeed = petStats.petManaSpeed || 0; //펫 종합 효과 마나회복속도
  const petMagicDamage = petStats.petMagicDamage || 0; //펫 종합 효과 마법 피해
  const petPhysicalDamage = petStats.petPhysicalDamage || 0; //펫 종합 효과 물리 피해
  const petCriticalPercent = petStats.petCriticalPercent || 0; //펫 종합 효과 치명타확률
  const petCriticalDamage = petStats.petCriticalDamage || 0; //펫 종합 효과 치명타 피해
  const artifactSkillDamage = artifactStats.artifactSkillDamage || 0;

  const artifactDefaultDamage =
    heroData.type === "magic"
      ? artifactStats.artifactMagicDamage
      : artifactStats.artifactPhysicalDamage;

  //펫 종합 마법/물리 피해 증가 퍼센트
  const petTotalDamage =
    heroData.type === "magic" ? petMagicDamage : petPhysicalDamage;

  const tresureCriticalDamage = tresureStats.tresureCriticalDamage; //신화 보물에 붙은 치명타 피해 퍼센트, 기본 피해량의 곱 합연산 ex.0.2
  const artifactCriticalDamage =
    heroData.type === "magic" ? artifactStats.artifactCriticalDamage : 0; //마법피해만 해당되는 유물 매직건틀렛 치명타 피해 퍼센트
  const artifactCriticalChance = artifactStats.artifactCriticalPercent / 100; //밤바인형 치명타 확률 증가 ex.0.032
  const artifactSkillChance = artifactStats.artifactSkillChance || 0; //스킬 발동 확률
  const artifactBossDamage = isBoss ? artifactStats.artifactBossDamage : 0; //보스에게 가하는 피해
  const artifactManaCallback = artifactStats.artifactManaCallback || 0; //궁극기 사용 시 마나 콜백

  const aps = finalSpeed ? finalSpeed : 1; // 최종 초당 공격 횟수
  const dur = 120; // 테스트 시간(초)
  const critChance = 0.05 + artifactCriticalChance + petCriticalPercent; // 치명타 확률 (기본 5% 가정, + 유물 밤바 + 펫 종합 효과)
  const critDamage =
    2.5 + artifactCriticalDamage + petCriticalDamage + tresureCriticalDamage; // 치명타 피해 배수 (기본 250% + (마법피해만)유물 치명타 피해 + 펫 종합 효과)

  const defaultDamage =
    finalPower *
      (1 + artifactDefaultDamage + petTotalDamage + artifactBossDamage) ||
    10000; // 기본 공격(유물 피해 증가, 펫 종합 피해 증가, 유물 대검 보스 공격)

  const lightLay = {
    name: "빛의 광선",
    percent: 0.1 + artifactSkillChance,
    power: 50,
  }; // 5000% = 50배

  const lightSeed = {
    name: "빛의 씨앗",
    percent: 0.12 + artifactSkillChance,
    power: 50,
    delay: 7000,
  }; // 7초 후 적용

  const supernova = {
    name: "초신성",
    manaDelay: 72, //유물 현자의 요거트 마나 바로 회복
    power: 1.5, // 공격력 및 스킬피해 배율
    duration: 30, // 유지 시간
  };

  const [baseDamage, setBaseDamage] = useState(defaultDamage); // 기본 공격(유물 피해 증가, 펫 종합 피해 증가, 유물 대검 보스 공격)

  const [running, setRunning] = useState(false);
  const [totalDamage, setTotalDamage] = useState(0);
  const [defaultDamageTotal, setDefaultDamageTotal] = useState(0); //기본 공격 데미지 누적
  const [lightLayDamageTotal, setLightLayDamageTotal] = useState(0); //빛의 광선 데미지 누적
  const [lightSeedDamageTotal, setLightSeedDamageTotal] = useState(0); //빛의 씨앗 데미지 누적
  const [defaultUseTotal, setDefaultUseTotal] = useState(0); //기본 공격 사용 누적
  const [lightLayUseTotal, setLightLayUseTotal] = useState(0); //빛의 광선 사용 누적
  const [lightSeedUseTotal, setLightSeedUseTotal] = useState(0); //빛의 씨앗 사용 누적
  const [supernovaUseTotal, setSupernovaUseTotal] = useState(0); //초신성 사용 누적
  const [oneDefaultDamage, setOneDefaultDamage] = useState(0); //1회 기본 공격 데미지
  const [oneLightLayDamage, setOneLightLayDamage] = useState(0); //1회 빛의 광선 데미지
  const [oneLightSeedDamage, setOneLightSeedDamage] = useState(0); //1회 빛의 씨앗 데미지
  const [attackCount, setAttackCount] = useState(0);
  const [pendingSeeds, setPendingSeeds] = useState([]);
  const [supernovaActive, setSupernovaActive] = useState(false);
  const [mana, setMana] = useState(0); // 0~100
  const [manaChargeTime, setManaChargeTime] = useState(
    (supernova.manaDelay - supernova.manaDelay * artifactManaCallback) /
      (1 + manaRecovery + petManaSpeed)
  );

  const [elapsedTime, setElapsedTime] = useState(0); // 경과 시간(초)

  const supernovaRef = useRef(false); // 👈 최신 상태 추적용 ref

  //보스상대인지, 최종 공격력, 마나회복속도, 공격속도가 바뀔 때마다 기본 피해량 업데이트
  useEffect(() => {
    setBaseDamage(defaultDamage);
  }, [isBoss, finalPower, manaRecovery, finalSpeed]);

  useEffect(() => {
    supernovaRef.current = supernovaActive;
    setUltimateActive(supernovaRef.current);
  }, [supernovaActive]);

  useEffect(() => {
    setManaChargeTime(
      (supernova.manaDelay - supernova.manaDelay * artifactManaCallback) /
        (1 + manaRecovery + petManaSpeed)
    );
  }, [manaRecovery, artifactStats]);

  useEffect(() => {
    if (!running) return; // 실행 중일 때만 작동

    let attackCounter = 0;
    let total = 0;
    let defaultTotal = 0; //기본공격 데미지 누적
    let lightLayTotal = 0; //빛의광선 데미지 누적
    let lightSeedTotal = 0; //빛의씨앗 데미지 누적
    let defaultUsed = 0; //기본공격 사용 누적
    let lightLayUsed = 0; //빛의광선 사용 누적
    let lightSeedUsed = 0; //빛의씨앗 사용 누적
    let supernovaUsed = 0; //초신성 사용 누적
    let oneDefaultDamage = 0; //1회당 기본공격 피해량
    let oneLightLayDamage = 0; //1회당 빛의광선 피해량
    let oneLightSeedDamage = 0; //1회당 빛의씨앗 피해량
    let seeds = [];
    let manaValue = 0;
    let supernovaInterval;
    let supernovaTimeout;
    let attackInterval;
    let elapsedInterval; // ⏱️ 경과시간용 interval

    const manaMax = 100;
    const manaPerSec = manaMax / manaChargeTime;

    // console.log(
    //   `테스트 시작: 초당 공격 횟수=${aps}, 테스트 시간=${dur}, 예상≈${(
    //     aps * dur
    //   ).toFixed(2)}회`
    // );

    // 🌟 초신성 발동 관리
    const startSupernovaCycle = () => {
      // 72초마다 자동 발동
      supernovaInterval = setInterval(() => {
        if (!supernovaRef.current) {
          manaValue += manaPerSec;
          if (manaValue >= 100) {
            // 🌌 초신성 발동
            manaValue = 100;
            setSupernovaActive(true);
            setUltimateActive(true);
            supernovaRef.current = true;
            setMana(100);
            supernovaUsed += 1;
            // console.log("🌟 초신성 발동! 공격력/스킬피해 +50%");
            supernovaTimeout = setTimeout(() => {
              setSupernovaActive(false);
              setUltimateActive(false);
              supernovaRef.current = false;
              manaValue = 0;
              // console.log("🌠 초신성 종료. 마나 재충전 시작");
            }, supernova.duration * 1000);
          }
          setMana(manaValue);
        }
      }, 1000);
    };

    // ⏱️ 경과 시간 측정 시작
    setElapsedTime(0);
    const startTime = Date.now();
    elapsedInterval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(seconds);
    }, 1000);

    startSupernovaCycle();

    attackInterval = setInterval(() => {
      attackCounter++;
      const isUltimate = supernovaRef.current; //초신성 상태인지 확인

      let isCrit = false;
      let isSkill = false;

      let damage = baseDamage * (isUltimate ? supernova.power : 1); //공격력 증가가 우선시 되어서 초신성 공격력%는 곱연산임, 스킬 피해도 어차피 50%라서 기본 데미지에 1.5배 곱하고 끝!
      // 💥 치명타 확률 계산
      if (Math.random() < critChance) {
        isCrit = true;
        damage *= 1 + petDefaultDamage;
        damage *= critDamage;
        defaultTotal += damage;
        defaultUsed += 1;
        // console.log(`치명타 발생! 💥 ${damage.toFixed(0)} 피해`);
      }

      // 🌟 빛의 광선 (즉시 피해)
      if (Math.random() < lightLay.percent) {
        isSkill = true;
        lightLayUsed += 1;
        const skillDamage = damage * lightLay.power * (1 + artifactSkillDamage);
        if (Math.random() < critChance) {
          const criticalDamage = skillDamage * critDamage;
          total += criticalDamage;
          lightLayTotal += criticalDamage;
          // console.log(
          //   `치명타:빛의 광선 발동! ⚡ ${criticalDamage.toFixed(0)} 피해 (즉시)`
          // );
        } else {
          total += skillDamage;
          lightLayTotal += skillDamage;
          oneLightLayDamage = skillDamage;
          // console.log(
          //   `빛의 광선 발동! ⚡ ${skillDamage.toFixed(0)} 피해 (즉시)`
          // );
        }
      }

      // 🌱 빛의 씨앗 (7초 후 피해)
      if (
        Math.random() < lightSeed.percent &&
        Number(heroData.heroLevel) >= 12
      ) {
        isSkill = true;
        lightSeedUsed += 1;
        seeds.push(Date.now());
        // console.log(
        //   `빛의 씨앗🌱 누적됨 (현재 ${seeds.length}개, 7초 후 폭발 예정)`
        // );
        setTimeout(() => {
          const skillDamage =
            damage * lightSeed.power * (1 + artifactSkillDamage);
          if (Math.random() < critChance) {
            const criticalDamage = skillDamage * critDamage;
            total += criticalDamage;
            lightSeedTotal += critDamage;
            seeds.shift();
            // console.log(
            //   `치명타:💥 빛의 씨앗 폭발! 남은 씨앗 ${seeds.length}개, 피해 ${criticalDamage}`
            // );
          } else {
            total += skillDamage;
            lightSeedTotal += skillDamage;
            oneLightSeedDamage = skillDamage;
            seeds.shift();
            // console.log(
            //   `💥 빛의 씨앗 폭발! 남은 씨앗 ${seeds.length}개, 피해 ${skillDamage}`
            // );
          }
        }, lightSeed.delay);
      }

      // 💬 일반 공격
      if (!isCrit && !isSkill) {
        damage *= 1 + petDefaultDamage;
        defaultTotal += damage;
        defaultUsed += 1;
        oneDefaultDamage = damage;
        // console.log(`👊 일반 공격: ${damage.toFixed(0)} 피해`);
      }

      total += damage;
      setAttackCount(attackCounter);
      setTotalDamage(total);
      setDefaultDamageTotal(defaultTotal);
      setLightLayDamageTotal(lightLayTotal);
      setLightSeedDamageTotal(lightSeedTotal);
      setDefaultUseTotal(defaultUsed);
      setLightLayUseTotal(lightLayUsed);
      setLightSeedUseTotal(lightSeedUsed);
      setSupernovaUseTotal(supernovaUsed);
      setOneDefaultDamage(oneDefaultDamage);
      setOneLightLayDamage(oneLightLayDamage);
      setOneLightSeedDamage(oneLightSeedDamage);
      setPendingSeeds([...seeds]);
    }, 1000 / aps);

    // 테스트 종료 타이머
    const stopTimer = setTimeout(() => {
      clearInterval(attackInterval);
      setRunning(false);
      setElapsedTime(dur);
    }, dur * 1000);

    // 언마운트 또는 종료 시 정리
    return () => {
      clearInterval(attackInterval);
      clearTimeout(stopTimer);
      clearInterval(supernovaInterval);
      clearTimeout(supernovaTimeout);
      clearInterval(elapsedInterval);
    };
  }, [running]);

  //피해량 포매터
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

  return (
    <>
      <div className={styles.testArea}>
        {elapsedTime >= dur && (
          <div className={styles.finishArea}>전투 측정이 종료되었습니다.</div>
        )}
        <div className={styles.timer}>
          <div className={styles.timerItem}>
            <p className={styles.title}>전투 시간</p>
            <p className={styles.dur}>{dur}초</p>
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
              setUltimateActive(false);
              setSupernovaActive(false);
              setMana(0);
            } else {
              setTotalDamage(0);
              setAttackCount(0);
              setPendingSeeds([]);
              setRunning(true);
            }
          }}
          className={`${styles.controlButton} ${running ? styles.setStop : ""}`}
        >
          {running ? "전투 종료" : "전투 시작"}
        </button>
        <div className={styles.ultimateWrapper}>
          <div className={styles.title}>
            초신성 상태:
            <strong style={{ color: supernovaActive ? "#ffeb3b" : "#aaa" }}>
              {supernovaActive ? " 발동" : " 회복 중"}
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
                background: supernovaActive
                  ? "linear-gradient(90deg, #ffcc00, #ff8800)"
                  : "linear-gradient(90deg, #007bff, #00d4ff)",
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <div style={{ fontSize: "12px", color: "#ccc" }}>
            마나: {mana.toFixed(1)}% / 충전속도
            {(1 + manaRecovery + petManaSpeed).toFixed(2)}배 (기본:
            {supernova.manaDelay}초, 마나회복속도 적용 후:{" "}
            {manaChargeTime.toFixed(2)}초)
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <div className={styles.titleWrapper}>전투측정표</div>
          <div className={styles.tableInner}>
            <ul className={styles.table}>
              <li className={styles.thead}>
                <div></div>
                <div>기본 공격</div>
                <div>{lightLay.name}</div>
                {Number(heroData.heroLevel) >= 12 && (
                  <div>{lightSeed.name}</div>
                )}
                <div>{supernova.name}</div>
              </li>
              <li className={styles.tbody}>
                <div>누적 피해량</div>
                <div>{formatNumber(defaultDamageTotal)}</div>
                <div>{formatNumber(lightLayDamageTotal)}</div>
                {Number(heroData.heroLevel) >= 12 && (
                  <div>{formatNumber(lightSeedDamageTotal)}</div>
                )}

                <div>-</div>
              </li>
              <li className={styles.tbody}>
                <div>발동 횟수</div>
                <div>{defaultUseTotal.toLocaleString()}</div>
                <div>{lightLayUseTotal.toLocaleString()}</div>
                {Number(heroData.heroLevel) >= 12 && (
                  <div>{lightSeedUseTotal.toLocaleString()}</div>
                )}
                <div>{supernovaUseTotal.toLocaleString()}</div>
              </li>
              <li className={styles.tbody}>
                <div>1회 피해량</div>
                <div>{Math.floor(oneDefaultDamage).toLocaleString()}</div>
                <div>{Math.floor(oneLightLayDamage).toLocaleString()}</div>
                {Number(heroData.heroLevel) >= 12 && (
                  <div>{Math.floor(oneLightSeedDamage).toLocaleString()}</div>
                )}
                <div>-</div>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.totalResultWrapper}>
          <div className={styles.resultBox}>
            <p className={styles.title}>⚔️ 총 피해량</p>
            <p className={styles.result}>{totalDamage.toLocaleString()}</p>
          </div>
          <div className={styles.resultBox}>
            <p className={styles.title}>🗡️ 1회 평균 피해량</p>
            <p className={styles.result}>
              {totalDamage / attackCount
                ? (totalDamage / attackCount).toLocaleString()
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
