import { useEffect, useRef } from "react";

export function useSkillCycle(options) {
  const {
    isRunning,
    manaPerSec = 1,
    manaDelay,
    manaReturn,
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
    setDeathHandStack,
    usedCrit,
  } = options;

  const manaRef = useRef(0);
  const critUsedRef = useRef(0);
  const stackRef = useRef(0);
  const activeRef = useRef(false);

  const manaIntervalId = useRef(null);
  const attackIntervalId = useRef(null);

  const start = () => {
    // 1) 마나 충전 루프 (항상 돈다)
    manaIntervalId.current = setInterval(() => {
      setMana(manaRef.current);
      manaRef.current += manaPerSec;

      setDeathHandStack(stackRef.current);

      if (manaRef.current >= 100) {
        activeRef.current = true; //지워야 할지도
        stackRef.current += 1;

        manaRef.current = manaReturn * 100; //유물 효과로 퍼센트 리턴

        onCast && onCast();
        let elapsed = 0;

        // // 공격 루프
        // attackIntervalId.current = setInterval(() => {
        //   elapsed += interval;
        //   if (elapsed >= duration) return;
        //   let dmg =
        //     baseDamage *
        //     power *
        //     (1 + artifactSkillDamage) *
        //     (extraMultiplier ?? 1);

        //   if (Math.random() < critChance) {
        //     critUsedRef.current += 1;
        //     dmg *= critDamage;
        //   }

        //   onHit && onHit(dmg);
        //   usedCrit(critUsedRef.current);
        // }, interval * 1000);

        // // duration 끝나면 공격 루프만 종료
        // setTimeout(() => {
        //   clearInterval(attackIntervalId.current);
        //   activeRef.current = false;

        //   onEnd && onEnd();
        // }, duration * 1000);

        // 공격 루프 (중첩마다 새로 생성)
        const attackId = setInterval(() => {
          if (!isRunning) {
            clearInterval(attackId);
            stackRef.current = 0;
            onEnd && onEnd();
            return;
          }

          elapsed += interval;
          if (elapsed >= duration) {
            clearInterval(attackId);
            stackRef.current -= 1; // duration 끝나면 중첩 제거
            if (stackRef.current === 0) {
              onEnd && onEnd();
            }
            return;
          }

          // 데미지 계산 시 중첩 수 곱하기
          let dmg =
            baseDamage *
            power *
            (1 + artifactSkillDamage) *
            (extraMultiplier ?? 1) *
            stackRef.current; // <- 중첩 반영

          if (Math.random() < critChance) {
            critUsedRef.current += 1;
            dmg *= critDamage;
          }

          onHit && onHit(dmg);
          usedCrit(critUsedRef.current);
        }, interval * 1000);
      }
    }, 1000);
  };

  const stop = () => {
    manaRef.current = 0;
    stackRef.current = 0;
    critUsedRef.current = 0;

    clearInterval(manaIntervalId.current);
    clearInterval(attackIntervalId.current);
  };

  useEffect(() => stop, []);

  return {
    start,
    stop,
  };
}
