"use client";

import { useState } from "react";
import styles from "./styles.module.css";

import powerPotion from "@/public/images/ic_powerPotion.png";
import fairyBow from "@/public/images/ic_fairyBow.png";
import sword from "@/public/images/ic_sword.png";
import secretBook from "@/public/images/ic_secretBook.png";
import bat from "@/public/images/ic_bat.png";
import wizardHat from "@/public/images/ic_wizardHat.png";
import oldBook from "@/public/images/ic_oldBook.png";
import magicGauntlet from "@/public/images/ic_magicGauntlet.png";
import moneyGun from "@/public/images/ic_moneyGun.png";
import yogurt from "@/public/images/ic_yogurt.png";
import bamba from "@/public/images/ic_bamba.png";
import haily from "@/public/images/tresure/haily.jpg";
import Image from "next/image";

//아이콘 리스트
const iconList = {
  powerPotion,
  fairyBow,
  secretBook,
  bat,
  wizardHat,
  oldBook,
  bamba,
  magicGauntlet,
  moneyGun,
  yogurt,
  sword,
  haily,
};

export default function SupportItem(props) {
  const { item, disabled, value, setValue, maxLevel } = props;

  const [open, setOpen] = useState(false);

  function openOption() {
    setOpen(!open);
  }

  return (
    <div
      className={`${styles.supportItem} ${disabled ? styles.disabled : ""}`}
      onClick={openOption}
    >
      <div className={styles.icon}>
        {item?.name && (
          <Image
            src={iconList[item.name]}
            width={48}
            height={48}
            alt={item.name}
          ></Image>
        )}
      </div>
      <div className={styles.infoArea}>
        <div className={styles.titleWrapper}>
          <p className={styles.title}>{item.title}</p>
          <div className={styles.statsBox}>
            <div className={styles.level}>
              <label>Lv.</label>
              <select value={value} onChange={setValue} disabled={disabled}>
                {/* 예: 0~10레벨까지 선택 가능 */}
                {Array.from({ length: maxLevel + 1 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={openOption} className={open ? styles.isOpen : ""}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 15L7 10H17L12 15Z" fill="#A7B2C7" />
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <div className={styles.supportDetail}>
            {Array.isArray(item.desc) ? (
              <>
                {item.desc.map((descItem, index) => (
                  <p key={index}>{descItem}</p>
                ))}
              </>
            ) : (
              <p>{item.desc}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
