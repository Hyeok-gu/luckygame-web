import { useRef, useState } from "react";

/**
 * 즉시 피해형 스킬 훅
 * @param options
 * - damage: 기본 공격력
 * - skill: { percent, power, name }
 * - artifactSkillDamage, critChance, critDamage
 * - extraMultiplier: (1 + otherHeroLength 등)
 */
export function useInstantSkill(options) {
  const {
    damage,
    skill,
    artifactSkillDamage = 0,
    critChance = 0,
    critDamage = 0,
    critUsed,
  } = options;

  const usedRef = useRef(0); // 사용 횟수
  const totalRef = useRef(0); // 스킬 총 누적 피해
  const [oneDamage, setOneDamage] = useState(0); // 1회 피해량

  const trigger = () => {
    if (Math.random() >= skill.percent) return 0; // 스킬 발동 안됨

    usedRef.current += 1;

    let skillDamage = damage * skill.power * (1 + artifactSkillDamage);
    let finalDamage = skillDamage;

    if (Math.random() < critChance) {
      critUsed();
      finalDamage = skillDamage * critDamage;
    }

    totalRef.current += finalDamage;
    setOneDamage(finalDamage);

    return finalDamage;
  };

  return {
    trigger, // 스킬 발동 함수
    oneDamage, // 마지막 1회 피해량
    used: usedRef.current, // 사용 횟수
    total: totalRef.current, // 누적 피해
  };
}
