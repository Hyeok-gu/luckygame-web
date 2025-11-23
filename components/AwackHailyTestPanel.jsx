"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/TestPannel.module.css";

export default function AwackHailyTestPanel({
  isTesting,
  heroData,
  finalPower,
  finalSpeed,
  artifactStats,
  petStats,
  manaRecovery = 0,
  setUltimateActive,
  isBoss,
  sameTarget,
  otherHeroLength = 0,
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

  const artifactCriticalDamage =
    heroData.type === "magic" ? artifactStats.artifactCriticalDamage : 0; //마법피해만 해당되는 유물 매직건틀렛 치명타 피해 퍼센트
  const artifactCriticalChance = artifactStats.artifactCriticalPercent; //밤바인형 치명타 확률 증가 ex.0.032
  const artifactSkillChance = artifactStats.artifactSkillChance || 0; //스킬 발동 확률
  const artifactBossDamage = isBoss ? artifactStats.artifactBossDamage : 0; //보스에게 가하는 피해
  const artifactManaCallback = artifactStats.artifactManaCallback || 0; //궁극기 사용 시 마나 콜백

  const aps = finalSpeed ? finalSpeed : 1; // 최종 초당 공격 횟수

  const critChance = 0.05 + artifactCriticalChance + petCriticalPercent; // 치명타 확률 (기본 5% 가정, + 유물 밤바 + 펫 종합 효과)
  const critDamage = 2.5 + artifactCriticalDamage + petCriticalDamage; // 치명타 피해 배수 (기본 250% + (마법피해만)유물 치명타 피해 + 펫 종합 효과)

  const defaultDamage =
    finalPower *
      (1 + artifactDefaultDamage + petTotalDamage + artifactBossDamage) ||
    10000; //(유물(마법사의 모자 또는 방망이) 피해 증가, 펫 종합(마법 또는 물리) 피해 증가, 유물 대검 보스 공격)

  const sunLay = {
    name: "태양 광선",
    percent: 0.1 + artifactSkillChance,
    power: 180,
  }; // 18000% = 180배

  const sunSeed = {
    name: "태초의 폭발",
    percent: 0.1 + artifactSkillChance + (heroData.heroLevel >= 12 ? 0.05 : 0),
    power: 100,
    delay: 10000,
  }; // 10초 후 적용

  const flare = {
    name: "플레어",
    manaDelay: 90,
    power: 45, // 공격력 및 스킬피해 배율
    duration: 10, // 유지 시간
  };

  const [baseDamage, setBaseDamage] = useState(defaultDamage); // 기본 공격(유물 피해 증가, 펫 종합 피해 증가, 유물 대검 보스 공격)
  const [testTime, setTestTime] = useState(180);
  const [running, setRunning] = useState(false);
  const [totalDamage, setTotalDamage] = useState(0);
  const [defaultDamageTotal, setDefaultDamageTotal] = useState(0); //기본 공격 데미지 누적
  const [sunLayDamageTotal, setSunLayDamageTotal] = useState(0); //태양 광선 데미지 누적
  const [sunSeedDamageTotal, setSunSeedDamageTotal] = useState(0); //태초의 폭발 데미지 누적
  const [flareDamageTotal, setFlareDamageTotal] = useState(0); //플레어 데미지 누적
  const [defaultUseTotal, setDefaultUseTotal] = useState(0); //기본 공격 사용 누적
  const [sunLayUseTotal, setSunLayUseTotal] = useState(0); //태양 광선 사용 누적
  const [sunSeedUseTotal, setSunSeedUseTotal] = useState(0); //태초의 폭발 사용 누적
  const [flareUseTotal, setFlareUseTotal] = useState(0); //플레어 사용 누적
  const [oneDefaultDamage, setOneDefaultDamage] = useState(0); //1회 기본 공격 데미지
  const [oneSunLayDamage, setOneSunLayDamage] = useState(0); //1회 태양 광선 데미지
  const [oneSunSeedDamage, setOneSunSeedDamage] = useState(0); //1회 태초의 폭발 데미지
  const [oneFlareDamage, setOneFlareDamage] = useState(0); //1회 플레어 데미지
  const [defaultCritTotal, setDefaultCritTotal] = useState(0); //기본 공격 치명타 발생 누적
  const [sunLayCritTotal, setSunLayCritTotal] = useState(0); //태양 광선 치명타 발생 누적
  const [sunSeedCritTotal, setSunSeedCritTotal] = useState(0); //태초의 폭발 치명타 발생 누적
  const [flareCritTotal, setFlareCritTotal] = useState(0); //플레어 치명타 발생 누적
  const [attackCount, setAttackCount] = useState(0);
  const [pendingSeeds, setPendingSeeds] = useState([]);
  const [flareActive, setFlareActive] = useState(false);
  const [mana, setMana] = useState(0); // 0~100
  const [manaChargeTime, setManaChargeTime] = useState(
    flare.manaDelay / (1 + manaRecovery + petManaSpeed)
  );

  const [elapsedTime, setElapsedTime] = useState(0); // 경과 시간(초)

  const flareRef = useRef(false); // 👈 최신 상태 추적용 ref

  //전투분석 상태 변할 때마다 부모에게 전달.
  useEffect(() => {
    isTesting(running);
  }, [running]);

  //보스상대인지, 최종 공격력, 마나회복속도, 공격속도가 바뀔 때마다 기본 피해량 업데이트
  useEffect(() => {
    setBaseDamage(defaultDamage);
  }, [isBoss, finalPower, manaRecovery, finalSpeed, sameTarget]);

  useEffect(() => {
    flareRef.current = flareActive;
    setUltimateActive(flareRef.current);
  }, [flareActive]);

  useEffect(() => {
    setManaChargeTime(flare.manaDelay / (1 + manaRecovery + petManaSpeed));
  }, [manaRecovery, artifactStats]);

  useEffect(() => {
    if (!running) return; // 실행 중일 때만 작동

    let attackCounter = 0;
    let total = 0;
    let defaultTotal = 0; //기본공격 데미지 누적
    let sunLayTotal = 0; //태양광선 데미지 누적
    let sunSeedTotal = 0; //태초의 폭발 데미지 누적
    let flareTotal = 0; //플레어 데미지 누적
    let defaultUsed = 0; //기본공격 사용 누적
    let sunLayUsed = 0; //태양광선 사용 누적
    let sunSeedUsed = 0; //태초의 폭발 사용 누적
    let flareUsed = 0; //플레어 사용 누적
    let oneDefaultDamage = 0; //1회당 기본공격 피해량
    let oneSunLayDamage = 0; //1회당 태양광선 피해량
    let oneSunSeedDamage = 0; //1회당 태초의 폭발 피해량
    let oneFlareDamage = 0; //1회당 플레어 피해량
    let critDefaultUsed = 0; //기본공격 치명타 발생 수
    let critSunLayUsed = 0; //태양광선 치명타 발생 수
    let critSunSeedUsed = 0; //태초의 폭발 치명타 발생 수
    let critFlareUsed = 0; //플레어 치명타 발생 수
    let seeds = [];
    let manaValue = 0;
    let flareInterval;
    let flareTimeout;
    let attackInterval;
    let elapsedInterval; // ⏱️ 경과시간용 interval
    let flareIntervalId;

    const manaMax = 100;
    const manaPerSec = manaMax / manaChargeTime;

    // 🌟 플레어 발동 관리
    const startFlareCycle = () => {
      // 90초마다 자동 발동
      flareInterval = setInterval(() => {
        if (!flareRef.current) {
          manaValue += manaPerSec;
          if (manaValue >= 100) {
            // 🌌 플레어 발동
            manaValue = 100;
            setFlareActive(true);
            setUltimateActive(true);
            flareRef.current = true;
            flareUsed += 1;
            setMana(100);
            // flareTimeout = setTimeout(() => {
            //   setFlareActive(false);
            //   setUltimateActive(false);
            //   flareRef.current = false;
            //   manaValue = 0;
            // }, flare.duration * 1000);
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

    startFlareCycle();

    // 플레어 상태 시작 시 0.4초마다 공격
    const startFlareAttack = () => {
      let flareAttackCounter = 0;
      flareIntervalId = setInterval(() => {
        if (!flareRef.current) return; // 플레어 끝나면 공격 중지
        flareAttackCounter++;
        attackCounter++;

        let damage =
          baseDamage *
          flare.power *
          (1 + artifactSkillDamage) *
          (1 + otherHeroLength); //곱연산

        if (Math.random() < critChance) {
          damage *= critDamage;
          critFlareUsed += 1;
        }

        flareTotal += damage;
        total += damage;

        // 10초 제한
        setFlareDamageTotal(flareTotal);
        setOneFlareDamage(damage);
        setFlareCritTotal(critFlareUsed);

        if (flareAttackCounter >= flare.duration / 0.4) {
          // 25회
          setFlareActive(false);
          setUltimateActive(false);
          flareRef.current = false;
          manaValue = artifactManaCallback * 100;
          setMana(artifactManaCallback * 100);
          flareAttackCounter = 0;
          return;
        }
      }, 400); // 0.4초
    };

    let flareAttacking = false;

    const flareObserver = setInterval(() => {
      if (flareRef.current && !flareAttacking) {
        flareAttacking = true;
        startFlareAttack(() => {
          flareAttacking = false; // 10초 공격 종료 후 플래그 해제
        });
      }
    }, 100);

    attackInterval = setInterval(() => {
      const isUltimate = flareRef.current; //플레어 상태인지 확인

      let isCrit = false;
      let isSkill = false;

      let damage = !isUltimate ? baseDamage : 0; //
      if (isUltimate) {
      } else {
        attackCounter++;
      }

      // 💥 치명타 확률 계산
      if (!isUltimate) {
        // 🌟 태양 광선 (즉시 피해)
        if (Math.random() < sunLay.percent) {
          isSkill = true;
          sunLayUsed += 1;
          const skillDamage =
            damage *
            sunLay.power *
            (1 + artifactSkillDamage) *
            (1 + otherHeroLength);

          if (Math.random() < critChance) {
            const criticalDamage = skillDamage * critDamage;
            critSunLayUsed += 1;
            total += criticalDamage;
            sunLayTotal += criticalDamage;
            // console.log(
            //   `치명타:빛의 광선 발동! ⚡ ${criticalDamage.toFixed(0)} 피해 (즉시)`
            // );
          } else {
            total += skillDamage;
            sunLayTotal += skillDamage;
            oneSunLayDamage = skillDamage;
          }
        }

        // 🌱 태초의 폭발 (7초 후 피해)
        if (Math.random() < sunSeed.percent) {
          isSkill = true;
          sunSeedUsed += 1;

          let skillDamage =
            damage *
            sunSeed.power *
            (1 + artifactSkillDamage) *
            (1 + otherHeroLength);

          if (!sameTarget) {
            // 기존: 다른 대상이면 지연 폭발
            seeds.push(Date.now());
            setTimeout(() => {
              if (Math.random() < critChance) {
                critSunSeedUsed += 1;
                const criticalDamage = skillDamage * critDamage;
                total += criticalDamage;
                sunSeedTotal += criticalDamage;
              } else {
                total += skillDamage;
                sunSeedTotal += skillDamage;
                oneSunSeedDamage = skillDamage;
              }
              seeds.shift();
            }, sunSeed.delay);
          } else {
            // 같은 대상이면 3번 누적 시 바로 폭발
            seeds.push(Date.now()); // 누적
            if (seeds.length % 3 === 0) {
              skillDamage *= 2;

              if (Math.random() < critChance) {
                critSunSeedUsed += 1;
                const criticalDamage = skillDamage * critDamage;
                total += criticalDamage;
                sunSeedTotal += criticalDamage;
              } else {
                total += skillDamage;
                sunSeedTotal += skillDamage;
                oneSunSeedDamage = skillDamage;
              }
              seeds = []; // 누적 초기화
            }
          }
        }

        if (Math.random() < critChance && !isSkill) {
          isCrit = true;
          critDefaultUsed += 1;
          damage *= 1 + petDefaultDamage;
          damage *= critDamage;
          defaultTotal += damage;
          defaultUsed += 1;
          total += damage;
          // console.log(`치명타 발생! 💥 ${damage.toFixed(0)} 피해`);
        }

        // 💬 일반 공격
        if (!isCrit && !isSkill) {
          damage *= 1 + petDefaultDamage;
          defaultTotal += damage;
          defaultUsed += 1;
          oneDefaultDamage = damage;
          total += damage;
        }
      }

      setTotalDamage(total);
      setAttackCount(attackCounter);
      setDefaultDamageTotal(defaultTotal);
      setSunLayDamageTotal(sunLayTotal);
      setSunSeedDamageTotal(sunSeedTotal);
      setDefaultUseTotal(defaultUsed);
      setSunLayUseTotal(sunLayUsed);
      setSunSeedUseTotal(sunSeedUsed);
      setFlareUseTotal(flareUsed);
      setOneDefaultDamage(oneDefaultDamage);
      setOneSunLayDamage(oneSunLayDamage);
      setOneSunSeedDamage(oneSunSeedDamage);
      setDefaultCritTotal(critDefaultUsed);
      setSunLayCritTotal(critSunLayUsed);
      setSunSeedCritTotal(critSunSeedUsed);
      setPendingSeeds([...seeds]);
    }, 1000 / aps);

    // 테스트 종료 타이머
    const stopTimer = setTimeout(() => {
      clearInterval(attackInterval);
      setRunning(false);
      setElapsedTime(testTime);
    }, testTime * 1000);

    // 언마운트 또는 종료 시 정리
    return () => {
      clearInterval(attackInterval);
      clearTimeout(stopTimer);
      clearInterval(flareInterval);
      clearTimeout(flareTimeout);
      clearInterval(elapsedInterval);
      clearInterval(flareIntervalId);
      clearInterval(flareObserver);
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
        {elapsedTime >= testTime && (
          <div className={styles.finishArea}>전투 측정이 종료되었습니다.</div>
        )}
        <div className={styles.timer}>
          <div className={styles.timerItem}>
            <p className={styles.title}>전투 시간 (초 단위)</p>
            <input
              className={styles.testTimeInput}
              type="number"
              placeholder="측정 시간 입력"
              value={testTime}
              inputMode="numeric"
              onChange={(e) => {
                let value = Number(e.target.value);
                if (value === 0 || value == null) {
                  alert("초 단위로 입력하세요");
                  value = 180;
                }
                setTestTime(value);
              }}
            ></input>
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
              setFlareActive(false);
              setMana(0);
            } else {
              setFlareDamageTotal(0);
              setTotalDamage(0);
              setSunLayDamageTotal(0);
              setSunSeedDamageTotal(0);
              setAttackCount(0);
              setOneDefaultDamage(0);
              setOneSunLayDamage(0);
              setOneSunSeedDamage(0);
              setOneFlareDamage(0);
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
            플레어 상태:
            <strong style={{ color: flareActive ? "#ffeb3b" : "#aaa" }}>
              {flareActive ? " 발동" : " 회복 중"}
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
                background: flareActive
                  ? "linear-gradient(90deg, #ffcc00, #ff8800)"
                  : "linear-gradient(90deg, #007bff, #00d4ff)",
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <div style={{ fontSize: "12px", color: "#ccc" }}>
            마나: {mana.toFixed(1)}% / 충전속도
            {(1 + manaRecovery + petManaSpeed).toFixed(2)}배 (기본:
            {flare.manaDelay}초, 마나회복속도 적용 후:
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
                <div>{sunLay.name}</div>
                <div>{sunSeed.name}</div>
                <div>{flare.name}</div>
              </li>
              <li className={styles.tbody}>
                <div>누적 피해량</div>
                <div>{formatNumber(defaultDamageTotal)}</div>
                <div>{formatNumber(sunLayDamageTotal)}</div>
                <div>{formatNumber(sunSeedDamageTotal)}</div>
                <div>{formatNumber(flareDamageTotal)}</div>
              </li>
              <li className={styles.tbody}>
                <div>발동 횟수</div>
                <div>{defaultUseTotal.toLocaleString()}</div>
                <div>{sunLayUseTotal.toLocaleString()}</div>
                <div>{sunSeedUseTotal.toLocaleString()}</div>
                <div>{flareUseTotal.toLocaleString()}</div>
              </li>
              <li className={styles.tbody}>
                <div>치명타 발생</div>
                <div>{defaultCritTotal.toLocaleString()}</div>
                <div>{sunLayCritTotal.toLocaleString()}</div>
                <div>{sunSeedCritTotal.toLocaleString()}</div>
                <div>{flareCritTotal.toLocaleString()}</div>
              </li>
              <li className={styles.tbody}>
                <div>1회 피해량</div>
                <div>{Math.floor(oneDefaultDamage).toLocaleString()}</div>
                <div>{Math.floor(oneSunLayDamage).toLocaleString()}</div>
                <div>{Math.floor(oneSunSeedDamage).toLocaleString()}</div>
                <div>{Math.floor(oneFlareDamage).toLocaleString()}</div>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.totalResultWrapper}>
          <div className={styles.resultBox}>
            <p className={styles.title}>⚔️ 총 피해량</p>
            <p className={styles.result}>{totalDamage.toLocaleString()}</p>
            <p className={styles.result}>{formatNumber(totalDamage)}</p>
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
