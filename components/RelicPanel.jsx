"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/RelicPanel.module.css";
import SectionTitle from "./ui/SectionTitle";
import SupportItem from "./ui/SupportItem";
import { artifactItems } from "@/util/arifactItems";
import { petLevelEffects } from "@/util/petLevelEffects";
import { tresureItems } from "@/util/tresureItems";
import { heroList } from "@/util/heroStat";

export default function RelicPanel({ refresh }) {
  const [selectedHero, setSelectedHero] = useState(heroList[0].value);
  const [selectedHeroData, setSelectedHeroData] = useState({});
  const [isTresure, setIsTresure] = useState(true); //신화 보물 유무
  const [selectedTresureInfo, setSelectedTresureInfo] = useState({}); //선택한 레벨의 신화 보물정보
  const [tresureLevel, setTresureLevel] = useState(1); //신화 보물 레벨 인풋상태
  const [powerPotionLevel, setPowerPotionLevel] = useState(1); //힘의 물약 유물 레벨 인풋상태
  const [fairyBowLevel, setFairyBowLevel] = useState(1); //요정활 유물 레벨 인풋상태
  const [swordLevel, setSwordLevel] = useState(1); //대검 유물 레벨 인풋상태
  const [secretBookLevel, setSecretBookLevel] = useState(1); //비전서 유물 레벨 인풋상태
  const [batLevel, setBatLevel] = useState(1); //방망이 유물 레벨 인풋상태
  const [wizardHatLevel, setWizardHatLevel] = useState(1); //마법사의 모자 유물 레벨 인풋상태
  const [oldBookLevel, setOldBookLevel] = useState(1); //오래된 책 유물 레벨 인풋상태
  const [magicGauntletLevel, setMagicGauntletLevel] = useState(1); //매직건틀렛 유물 레벨 인풋상태
  const [bambaLevel, setBambaLevel] = useState(1); //밤바인형 유물 레벨 인풋상태
  const [moneyGunLevel, setmoneyGunLevel] = useState(1); //머니건 유물 레벨 인풋상태
  const [yogurtLevel, setYogurtLevel] = useState(1); //현자의 요거트 유물 레벨 인풋상태
  const [tresureStats, setTresureStats] = useState({
    tresureCriticalDamage: 0, //신화 보물 치명타 피해 퍼센트
  }); //신화 보물 효과
  const [artifactStats, setArtifactStats] = useState({
    artifactPower: 0, // 전체 공격력
    artifactSpeed: 0, // 전체 공격속도
    artifactSkillDamage: 0, // 스킬 피해
    artifactPhysicalDamage: 0, // 물리 피해
    artifactMagicDamage: 0, // 마법 피해
    artifactCriticalDamage: 0, // 치명타 피해
    artifactCoinPower: 0, // 머니건: 코인 기반 공격력
  });

  const [petTotalLevel, setPetTotalLevel] = useState(0); //펫 종합 레벨
  const [herosTotalLevel, setHerosTotalLevel] = useState(0); //영웅 종합 레벨
  const [herosStat, setHerosStat] = useState(0); //영웅 종합 레벨 공격력 증가 효과
  const [petStats, setPetStats] = useState({
    //펫 능력치 관리
    petPower: 0, // 공격력 %
    petSpeed: 0, // 공격속도 %
    petManaSpeed: 0, // 마나 회복 속도 %
    petDefaultDamage: 0, // 기본 공격 피해 %
    petBossDamage: 0, // 보스 몬스터 공격 피해 %
    petPhysicalDamage: 0, // 물리 피해 %
    petMagicDamage: 0, // 마법 피해 %
    petAloneDamage: 0, // 단일 피해 %
    petAroundDamage: 0, // 범위 피해 %
    petAltimateDamage: 0, // 궁극기 피해 %
    petCriticalDamage: 0, // 치명타 피해 %
    petCriticalPercent: 0, // 치명타 확률 %
    petSlot: 0, // 펫 슬롯 개수
  });

  //로컬스토리지에 저장된 신화 정보 가져오기
  useEffect(() => {
    const loadedHeroInfoString = localStorage.getItem("heroData");
    const loadedHeroInfo = loadedHeroInfoString
      ? JSON.parse(loadedHeroInfoString)
      : null;
    setSelectedHero(loadedHeroInfo?.enName || heroList[0].value);
    setSelectedHeroData(loadedHeroInfo || null);
  }, [refresh]);

  //보물 버프및 유물과 펫/신화 종합 버프 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem("petStats", JSON.stringify(petStats));
    localStorage.setItem("heroStats", JSON.stringify(herosStat));
    localStorage.setItem("artifactStats", JSON.stringify(artifactStats));
    localStorage.setItem("tresureStats", JSON.stringify(tresureStats));
  }, [petStats, artifactStats, tresureStats, tresureLevel, herosStat]);

  //유물 효과 관리 액션
  useEffect(() => {
    setArtifactStats({
      artifactPower: artifactItems.powerPotion.effect[powerPotionLevel] / 100,
      artifactSpeed: artifactItems.fairyBow.effect[fairyBowLevel] / 100,
      artifactBossDamage: artifactItems.sword.effect[swordLevel] / 100,
      artifactSkillDamage:
        artifactItems.secretBook.effect[secretBookLevel] / 100,
      artifactPhysicalDamage: artifactItems.bat.effect[batLevel] / 100,
      artifactMagicDamage: artifactItems.wizardHat.effect[wizardHatLevel] / 100,
      artifactSkillChance: artifactItems.oldBook.effect[oldBookLevel] / 100,
      artifactCriticalPercent: artifactItems.bamba.effect[bambaLevel],
      artifactCriticalDamage:
        artifactItems.magicGauntlet.effect[magicGauntletLevel] / 100,
      artifactManaCallback: artifactItems.yogurt.effect[yogurtLevel] / 100, // 코인 기반은 그대로
      artifactCoinPower: artifactItems.moneyGun.effect[moneyGunLevel], // 코인 기반은 그대로
    });
  }, [
    powerPotionLevel,
    fairyBowLevel,
    swordLevel,
    secretBookLevel,
    batLevel,
    wizardHatLevel,
    oldBookLevel,
    bambaLevel,
    magicGauntletLevel,
    yogurtLevel,
    moneyGunLevel,
  ]);

  // ✅ 누적 효과 계산 및 petStats 갱신
  useEffect(() => {
    const newStats = {
      petPower: 0,
      petSpeed: 0,
      petManaSpeed: 0,
      petDefaultDamage: 0,
      petBossDamage: 0,
      petPhysicalDamage: 0,
      petMagicDamage: 0,
      petAloneDamage: 0,
      petAroundDamage: 0,
      petAltimateDamage: 0,
      petCriticalDamage: 0,
      petCriticalPercent: 0,
      petSlot: 0,
    };

    Object.entries(petLevelEffects).forEach(([level, effect]) => {
      if (Number(level) <= petTotalLevel) {
        const val = extractPercent(effect); // 소수형 예: 0.02, 0.05
        if (effect.includes("공격력")) newStats.petPower += val;
        if (effect.includes("공격속도")) newStats.petSpeed += val;
        if (effect.includes("마나 회복 속도")) newStats.petManaSpeed += val;
        if (effect.includes("기본 공격 피해")) newStats.petDefaultDamage += val;
        if (effect.includes("보스몬스터 공격")) newStats.petBossDamage += val;
        if (effect.includes("물리 피해")) newStats.petPhysicalDamage += val;
        if (effect.includes("마법 피해")) newStats.petMagicDamage += val;
        if (effect.includes("단일 피해")) newStats.petAloneDamage += val;
        if (effect.includes("범위 피해")) newStats.petAroundDamage += val;
        if (effect.includes("궁극기 피해")) newStats.petAltimateDamage += val;
        if (effect.includes("치명타 피해")) newStats.petCriticalDamage += val;
        if (effect.includes("치명타 확률")) newStats.petCriticalPercent += val;
        if (effect.includes("펫 슬롯")) newStats.petSlot += extractPlus(effect);
      }
    });

    setPetStats(newStats);
  }, [petTotalLevel]);

  //신화 보물 레벨 변경시마다 해당 레벨의 스펙 저장
  useEffect(() => {
    getTresureValue();
  }, [tresureLevel]);

  // % 숫자 추출 함수
  const extractPercent = (str) => {
    const match = str.match(/([+\-]?\d+)%/);
    return match ? parseFloat(match[1]) / 100 : 0;
  };

  const extractPlus = (str) => {
    const match = str.match(/\+(\d+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  //유물 레벨 변경액션
  function artifactLevelChange(e, state) {
    const value = Number(e.target.value);
    // if (value === 0) {
    //   alert("최소 레벨이 1 이상이어야 합니다.");
    // } else {
    //   state(value);
    // }
    state(value);
  }

  //펫 및 영웅 종합 레벨 변경액션
  function totalLevelChange(e, state) {
    const value = Number(e.target.value);
    state(value);
  }

  // 펫 종합 레벨 이하의 효과 누적
  const cumulativeEffects = Object.entries(petLevelEffects)
    .filter(([level]) => Number(level) <= petTotalLevel)
    .map(([_, effect]) => effect);

  const petEffectTotals = {};
  const singleEffects = [];

  cumulativeEffects.forEach((effect) => {
    // 정규식으로 "+숫자" 형태를 모두 잡음 (%, 개수 등)
    const match = effect.match(/(.+?)([+\-]?\d+)([%개]?)$/);

    if (match) {
      const key = match[1].trim(); // 예: "공격력 ", "펫 슬롯 "
      const value = parseFloat(match[2]);
      const unit = match[3] || ""; // %, 개 등

      const fullKey = key + unit;

      // %면 누적합, 개수형(+1 등)도 합산
      petEffectTotals[fullKey] = (petEffectTotals[fullKey] || 0) + value;
    } else {
      // 합산할 수 없는 비정량 효과는 별도 리스트에
      singleEffects.push(effect);
    }
  });

  //신화 보물 데이터 가공
  const getTresureValue = () => {
    const data = tresureItems[selectedHero];
    let result = {};
    // 선택한 신화가 헤일리인 경우..
    if (selectedHero === "haily") {
      result = {
        name: selectedHero,
        title: data.title,
        desc: [
          `별의 힘 획득 확률 ${Math.trunc(
            //소수점 버림
            data.effect[tresureLevel].getPercent * 100
          )}% 증가`,
          `치명타 피해 ${Math.trunc(
            data.effect[tresureLevel].tresureCriticalDamage * 100
          )}% 증가`,
        ],
      };
      setSelectedTresureInfo(result);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.tresureArea}>
        <SectionTitle
          title="신화 보물 설정"
          description="선택한 신화의 보물을 설정하세요"
        />
        {tresureItems[selectedHero] ? (
          <SupportItem
            disabled={!isTresure}
            value={tresureLevel}
            maxLevel={11}
            setValue={(e) => {
              const value = Number(e.target.value);
              setTresureLevel(value);
              const data = tresureItems[selectedHero];
              const effect = data?.effect?.[value];
              setTresureStats(effect);
            }}
            item={selectedTresureInfo}
          />
        ) : (
          <div className={styles.emptyBox}>
            해당 영웅에게는 보물이 없습니다.
          </div>
        )}
      </div>
      <div className={styles.artifactArea}>
        <SectionTitle
          title="유물 설정"
          description="현재 보유한 유물의 레벨을 설정하세요"
        />
        <div className={styles.inner}>
          <SupportItem
            value={powerPotionLevel}
            maxLevel={11}
            setValue={(e) => {
              artifactLevelChange(e, setPowerPotionLevel);
            }}
            item={{
              name: artifactItems.powerPotion.name,
              title: artifactItems.powerPotion.title,
              desc:
                artifactItems.powerPotion.desc +
                artifactItems.powerPotion.effect[powerPotionLevel] +
                "% 증가",
            }}
          />
          <SupportItem
            value={fairyBowLevel}
            maxLevel={11}
            setValue={(e) => {
              artifactLevelChange(e, setFairyBowLevel);
            }}
            item={{
              name: artifactItems.fairyBow.name,
              title: artifactItems.fairyBow.title,
              desc:
                artifactItems.fairyBow.desc +
                artifactItems.fairyBow.effect[fairyBowLevel] +
                "% 증가",
            }}
          />
          <SupportItem
            value={swordLevel}
            maxLevel={11}
            setValue={(e) => {
              artifactLevelChange(e, setSwordLevel);
            }}
            item={{
              name: artifactItems.sword.name,
              title: artifactItems.sword.title,
              desc:
                artifactItems.sword.desc +
                artifactItems.sword.effect[swordLevel] +
                "% 증가",
            }}
          />
          <SupportItem
            value={secretBookLevel}
            maxLevel={11}
            setValue={(e) => {
              artifactLevelChange(e, setSecretBookLevel);
            }}
            item={{
              name: artifactItems.secretBook.name,
              title: artifactItems.secretBook.title,
              desc:
                artifactItems.secretBook.desc +
                artifactItems.secretBook.effect[secretBookLevel] +
                "% 증가",
            }}
          />
          <SupportItem
            value={batLevel}
            maxLevel={11}
            setValue={(e) => {
              artifactLevelChange(e, setBatLevel);
            }}
            item={{
              name: artifactItems.bat.name,
              title: artifactItems.bat.title,
              desc:
                artifactItems.bat.desc +
                artifactItems.bat.effect[batLevel] +
                "% 증가",
            }}
          />
          <SupportItem
            value={wizardHatLevel}
            maxLevel={11}
            setValue={(e) => {
              artifactLevelChange(e, setWizardHatLevel);
            }}
            item={{
              name: artifactItems.wizardHat.name,
              title: artifactItems.wizardHat.title,
              desc:
                artifactItems.wizardHat.desc +
                artifactItems.wizardHat.effect[wizardHatLevel] +
                "% 증가",
            }}
          />
          <SupportItem
            value={oldBookLevel}
            maxLevel={11}
            setValue={(e) => {
              artifactLevelChange(e, setOldBookLevel);
            }}
            item={{
              name: artifactItems.oldBook.name,
              title: artifactItems.oldBook.title,
              desc:
                artifactItems.oldBook.desc +
                artifactItems.oldBook.effect[oldBookLevel] +
                "% 증가",
            }}
          />
          <SupportItem
            value={bambaLevel}
            maxLevel={11}
            setValue={(e) => {
              artifactLevelChange(e, setBambaLevel);
            }}
            item={{
              name: artifactItems.bamba.name,
              title: artifactItems.bamba.title,
              desc:
                artifactItems.bamba.desc +
                artifactItems.bamba.effect[bambaLevel] +
                "% 증가",
            }}
          />
          <SupportItem
            value={magicGauntletLevel}
            maxLevel={11}
            setValue={(e) => {
              artifactLevelChange(e, setMagicGauntletLevel);
            }}
            item={{
              name: artifactItems.magicGauntlet.name,
              title: artifactItems.magicGauntlet.title,
              desc:
                artifactItems.magicGauntlet.desc +
                artifactItems.magicGauntlet.effect[magicGauntletLevel] +
                "% 증가",
            }}
          />
          <SupportItem
            value={yogurtLevel}
            maxLevel={11}
            setValue={(e) => {
              artifactLevelChange(e, setYogurtLevel);
            }}
            item={{
              name: artifactItems.yogurt.name,
              title: artifactItems.yogurt.title,
              desc:
                artifactItems.yogurt.desc +
                artifactItems.yogurt.effect[yogurtLevel] +
                "% 반환",
            }}
          />
          <SupportItem
            value={moneyGunLevel}
            maxLevel={11}
            setValue={(e) => {
              artifactLevelChange(e, setmoneyGunLevel);
            }}
            item={{
              name: artifactItems.moneyGun.name,
              title: artifactItems.moneyGun.title,
              desc:
                artifactItems.moneyGun.desc +
                artifactItems.moneyGun.effect[moneyGunLevel] +
                "% 증가",
            }}
          />
        </div>
      </div>
      <div className={styles.petLevelArea}>
        <SectionTitle
          title="펫&영웅 종합 레벨 설정"
          description="펫과 영웅의 종합레벨을 선택하세요"
        />
        <div className={styles.inner}>
          <div className={styles.levelBox}>
            <div className={styles.titleWrapper}>
              펫 종합
              <div className={styles.level}>
                <label>Lv.</label>
                <select
                  value={petTotalLevel}
                  onChange={(e) => totalLevelChange(e, setPetTotalLevel)}
                >
                  {Array.from({ length: 26 }, (_, i) => {
                    const level = i * 20;
                    return (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className={styles.levelEffectDetail}>
              {cumulativeEffects.length > 0 ? (
                <>
                  {/* ✅ 종합 결과 */}
                  <div className={styles.totalSummary}>
                    <p>📊 종합 효과 요약</p>
                    <ul>
                      {Object.entries(petEffectTotals).map(([key, value]) => {
                        const isDisabled =
                          key === "단일 피해%" ||
                          key === "보스몬스터 공격 시 피해%" ||
                          key === "범위 피해%" ||
                          key === "궁극기 피해%";
                        return (
                          <li
                            key={key}
                            className={isDisabled ? styles.effectDisabled : ""}
                            title={
                              isDisabled ? "해당 효과는 분석 중입니다." : null
                            }
                          >
                            {key} +{value}
                          </li>
                        );
                      })}
                      {singleEffects.map((e, i) => {
                        const isDisabled = e === "스킬 쿨타임 5% 감소";
                        return (
                          <li
                            key={`single-${i}`}
                            className={isDisabled ? styles.effectDisabled : ""}
                            title={
                              isDisabled ? "해당 효과는 분석 중입니다." : null
                            }
                          >
                            {e}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              ) : (
                <p>효과 없음</p>
              )}
            </div>
          </div>
          <div className={styles.levelBox}>
            <div className={styles.titleWrapper}>
              영웅 종합
              <div className={styles.level}>
                <label>Lv.</label>
                <select
                  value={herosTotalLevel}
                  onChange={(e) => {
                    totalLevelChange(e, setHerosTotalLevel);
                    setHerosStat(e.target.value * 0.05);
                  }}
                >
                  {Array.from({ length: 51 }, (_, i) => {
                    const level = i * 10;
                    return (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <p className={styles.levelEffectDetail}>공격력 {herosStat}% 증가</p>
          </div>
        </div>
        <div className={styles.emptyBox}>
          펫별 능력치 & 블롭 피규어는 현재 준비중입니다.
          <p>사실 개발자가 아직 피규어 기능을 못 열었어요.</p>
        </div>
      </div>
    </div>
  );
}
