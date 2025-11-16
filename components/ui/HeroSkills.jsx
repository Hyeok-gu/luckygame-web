import { useState } from "react";
import { heroStat } from "@/util/heroStat";
import styles from "./styles.module.css";

export default function HeroSkills({ hero = "haily", heroLevel }) {
  const skills = heroStat[hero].skill;
  const skillNames = Object.keys(skills);

  const [selectedSkill, setSelectedSkill] = useState(skillNames[0]);

  return (
    <div>
      {/* 스킬 버튼 탭 */}
      <div className={styles.skillTabs}>
        {skillNames.map((skillKey) => (
          <button
            key={skillKey}
            className={`${styles.skillBtn} ${
              selectedSkill === skillKey ? styles.active : ""
            }`}
            onClick={() => setSelectedSkill(skillKey)}
          >
            {skills[skillKey].name}
          </button>
        ))}
      </div>

      {/* 선택된 스킬 설명 */}
      <div className={styles.skillDesc}>
        <p>
          {hero === "awackHaily" &&
          selectedSkill === "sunSeed" &&
          heroLevel >= 12
            ? "10%(+5%)"
            : hero === "awackHaily" && selectedSkill === "sunSeed"
            ? "10%"
            : ""}
          {skills[selectedSkill]?.desc || ""}
          {hero === "haily" && selectedSkill === "starPower" && heroLevel >= 6
            ? "(+200%)"
            : ""}
          {hero === "awackHaily" && selectedSkill === "flare" && heroLevel >= 6
            ? "(+50%)"
            : ""}
        </p>
      </div>
    </div>
  );
}
