import { useEffect, useRef } from "react";

export function useSkillCycle(options) {
  const {
    manaPerSec = 1,
    manaDelay,
    duration,
    interval,
    power,
    extraMultiplier = 1,
    baseDamage,
    artifactSkillDamage,
    critChance,
    critDamage,
    onHit,
    onCast,
    onEnd,
    setMana,
    usedCrit,
  } = options;

  const manaRef = useRef(0);
  const critUsedRef = useRef(0);
  const activeRef = useRef(false);

  const manaIntervalId = useRef(null);
  const attackIntervalId = useRef(null);

  const start = () => {
    // 1) 마나 충전 루프 (항상 돈다)
    manaIntervalId.current = setInterval(() => {
      setMana(manaRef.current);
      manaRef.current += manaPerSec;
      if (manaRef.current >= 100) {
        activeRef.current = true;

        // 스킬 발동 직후 마나는 0으로
        manaRef.current = 0;
        onCast && onCast();

        let elapsed = 0;
        let attackCount = 0;

        // 공격 루프
        attackIntervalId.current = setInterval(() => {
          elapsed += interval;
          attackCount += 1;
          if (elapsed >= duration) return;
          let dmg =
            baseDamage *
            power *
            (1 + artifactSkillDamage) *
            (extraMultiplier ?? 1);

          if (Math.random() < critChance) {
            critUsedRef.current += 1;
            dmg *= critDamage;
          }

          onHit && onHit(dmg);
          usedCrit(critUsedRef.current);
        }, interval * 1000);

        // duration 끝나면 공격 루프만 종료
        setTimeout(() => {
          clearInterval(attackIntervalId.current);
          activeRef.current = false;

          onEnd && onEnd();
        }, duration * 1000);
      }
    }, 1000);
  };

  const stop = () => {
    manaRef.current = 0;
    critUsedRef.current = 0;
    clearInterval(manaIntervalId.current);
    clearInterval(attackIntervalId.current);
  };

  useEffect(() => stop, []);

  return { start, stop, critUsed: critUsedRef.current };
}
