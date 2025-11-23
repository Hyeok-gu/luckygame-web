export const heroList = [
  {
    enName: "haily",
    label: "헤일리",
    gender: "human",
    type: "magic",
  },
  {
    enName: "awackHaily",
    label: "각성 헤일리",
    gender: "human",
    type: "magic",
  },
  {
    enName: "reaperDian",
    label: "사신 다이안",
    gender: "human",
    type: "magic",
  },
  // {
  //   value: "ninja",
  //   label: "불멸 닌자",
  //   gender: "human",
  //   type: "pysical",
  // },
];

export const heroStat = {
  haily: {
    name: "헤일리",
    gender: "human",
    type: "magic",
    skill: {
      starPower: {
        name: "별의 힘",
        desc: "소환 버튼으로 영웅을 소환하면 20% 확률로 별의 힘을 받습니다. 별의 힘은 최대 10 만큼 누적됩니다. 별의 힘을 얻으면 공격력이 다음과 같이 증가합니다. 200%",
      },
      lightLay: {
        name: "빛의 광선",
        desc: "10% 확률로 눈에서 레이저를 발사해 범위 내 적에게 공격력의 5000% 마법피해를 줍니다.",
        percent: 10, //스킬 사용 확률
        power: 5000, //공격력의 증가량 퍼센트
      },
      lightSeed: {
        name: "빛의 씨앗",
        desc: "12% 확률로 대상에게 에너지를 주입하고 7초 뒤 폭발하여 범위 내 적에게 공격력의 5000% 마법피해를 줍니다.",
        percent: 12,
        power: 5000,
      },
      supernova: {
        name: "초신성",
        isUltimate: true, //궁극기인지 상태
        isMana: true, //마나를 사용하는지
        manaDelay: 72, //마나가 채워지는 시간
        isCooldown: false, //물리 쿨타임인지
        CooldownDelay: null, //물리 쿨타임 시간
        desc: "30초 동안 별의 힘 공격력 증가량을 50% 증가 시키고 모든 스킬 피해가 50% 증가합니다.",
        percent: 0, //스킬 사용 확률(마나 타입이라 0)
        power: 50, //공격력의 증가량 퍼센트
        damage: 50, //모든 스킬 피해니까 피해량 퍼센트
        duration: 30, //지속시간
      },
    },
    levelStat: [
      { level: 1, defaultPower: 19188, defaultSpeed: 1.5 },
      { level: 2, defaultPower: 20158, defaultSpeed: 1.5 },
      { level: 3, defaultPower: 23197, defaultSpeed: 1.5 },
      { level: 4, defaultPower: 24255, defaultSpeed: 1.5 },
      { level: 5, defaultPower: 25314, defaultSpeed: 1.5 },
      { level: 6, defaultPower: 26372, defaultSpeed: 1.5 },
      { level: 7, defaultPower: 27430, defaultSpeed: 1.5 },
      { level: 8, defaultPower: 28489, defaultSpeed: 1.5 },
      { level: 9, defaultPower: 29547, defaultSpeed: 1.65 },
      { level: 10, defaultPower: 30605, defaultSpeed: 1.65 },
      { level: 11, defaultPower: 31664, defaultSpeed: 1.65 },
      { level: 12, defaultPower: 32722, defaultSpeed: 1.65 },
      { level: 13, defaultPower: 33780, defaultSpeed: 1.65 },
      { level: 14, defaultPower: 34838, defaultSpeed: 1.65 },
      { level: 15, defaultPower: 39139, defaultSpeed: 1.8 },
    ],
    levelEffect: [
      {
        level: 3,
        desc: "공격력 +10% 증가합니다",
      },
      {
        level: 6,
        desc: "[별의 힘]공격력 증가 수치가 200% 증가합니다",
      },
      {
        level: 9,
        desc: "공격속도가 +10% 증가합니다",
      },
      {
        level: 10,
        desc: "[보물]이 해금됩니다",
      },
      {
        level: 12,
        desc: "[빛의 씨앗] 스킬이 해금됩니다",
      },
      {
        level: 15,
        desc: "공격력과 공격속도가 +10% 증가합니다",
      },
    ],
  },
  awackHaily: {
    name: "각성 헤일리",
    gender: "human",
    type: "magic",
    skill: {
      sunPower: {
        name: "태양의 힘",
        desc: "태양의 힘으로 공격력이 2000% 증가합니다. 추가로 내 필드 위에 있는 다른 신화 종류 당 스킬 피해가 5% 증가합니다.",
      },
      sunLay: {
        name: "태양 광선",
        desc: "10% 확률로 범위 내 적에게 공격력의 18,000% 마법피해를 줍니다.",
        percent: 10, //스킬 사용 확률
        power: 18000, //공격력의 증가량 퍼센트
      },
      sunSeed: {
        name: "태초의 폭발",
        desc: "확률로 대상에게 에너지를 주입하고 10초 뒤 폭발하여 범위 내 적에게 공격력의 10,000% 마법피해를 줍니다. 같은 대상에게 에너지가 3번 주입되면 즉시 폭발하며 피해가 100% 증가합니다.",
        percent: 10,
        power: 10000,
      },
      flare: {
        name: "플레어",
        isUltimate: true, //궁극기인지 상태
        isMana: true, //마나를 사용하는지
        manaDelay: 90, //마나가 채워지는 시간
        isCooldown: false, //물리 쿨타임인지
        CooldownDelay: null, //물리 쿨타임 시간
        desc: "10초 동안 작은 태양을 들어 0.4초마다 공격력의 4,500% 마법피해를 줍니다. 주변 적에게는 다음과 같은 피해를 줍니다. 50% ",
        percent: 0, //스킬 사용 확률(마나 타입이라 0)
        power: 50, //공격력의 증가량 퍼센트
        damage: 50, //모든 스킬 피해니까 피해량 퍼센트
        duration: 10, //지속시간
      },
    },
    levelStat: [
      { level: 1, defaultPower: 54600, defaultSpeed: 1.5 }, // 54.6k (주어짐)
      { level: 2, defaultPower: 67600, defaultSpeed: 1.5 }, // 67.6k (주어짐)
      { level: 3, defaultPower: 71120, defaultSpeed: 1.5 }, // 2->3: +3.52k (3.2*1.1)
      { level: 4, defaultPower: 81398, defaultSpeed: 1.5 }, // 81.4k (고정, 주어짐)
      { level: 5, defaultPower: 84937, defaultSpeed: 1.5 }, // +3.2k
      { level: 6, defaultPower: 88476, defaultSpeed: 1.5 }, // 88.5k (고정, 주어짐)
      { level: 7, defaultPower: 92015, defaultSpeed: 1.5 }, // 91.7k (고정, 주어짐)
      { level: 8, defaultPower: 95554, defaultSpeed: 1.5 }, // 95.6k (고정, 주어짐)
      { level: 9, defaultPower: 99094, defaultSpeed: 1.65 }, // 99.1k (고정, 주어짐)
      { level: 10, defaultPower: 102633, defaultSpeed: 1.65 }, // +3.2k
      { level: 11, defaultPower: 106172, defaultSpeed: 1.65 }, // +3.2k
      { level: 12, defaultPower: 109711, defaultSpeed: 1.65 }, // +3.2k
      { level: 13, defaultPower: 113250, defaultSpeed: 1.65 }, // +3.2k
      { level: 14, defaultPower: 116789, defaultSpeed: 1.65 }, // +3.2k
      { level: 15, defaultPower: 120682, defaultSpeed: 1.8 }, // +3.2k
    ],
    levelEffect: [
      {
        level: 3,
        desc: "공격력 +10% 증가합니다",
      },
      {
        level: 6,
        desc: "[플레어] 스킬의 주변 적에게 주는 피해가 50% 증가합니다",
      },
      {
        level: 9,
        desc: "공격속도가 +10% 증가합니다",
      },
      {
        level: 12,
        desc: "[태초의 폭발] 스킬의 확률이 +5% 증가합니다",
      },
      {
        level: 15,
        desc: "공격력과 공격속도가 +10% 증가합니다",
      },
    ],
  },
  reaperDian: {
    name: "사신 다이안",
    gender: "human",
    type: "magic",
    skill: {
      reaperEndowment: {
        name: "사신의 자질",
        desc: "적에게 피해를 줄 때 체력이 5% 미만인 적은 즉시 처형시킵니다.",
      },
      deathThunder: {
        name: "죽음의 번개",
        desc: "기본 공격이 범위 내 적에게 공격력의 2000% 마법피해로 적용됩니다.",
        percent: 1, //스킬 사용 확률
        power: 2000, //공격력의 증가량 퍼센트
      },
      relayThunder: {
        name: "연쇄 번개",
        desc: "확률로 적에게 공격력의 35000% 마법 피해를 입히고 10회만큼 주변 적에게 피해가 전달됩니다.",
        percent: 0.08,
        power: 350,
      },
      deathHand: {
        name: "죽음의 손길",
        manaDelay: 90, //마나가 채워지는 시간
        desc: "20초 동안 지속되는 지옥을 소환해 0.1초마다 공격력의 600% 마법피해를 줍니다.",
        power: 6, //공격력의 증가량 퍼센트
        duration: 20, //지속시간
      },
    },
    levelStat: [
      { level: 1, defaultPower: 76171, defaultSpeed: 1.5 }, // 54.6k (주어짐)
      { level: 2, defaultPower: 79999, defaultSpeed: 1.5 }, // 67.6k (주어짐)
      { level: 3, defaultPower: 83827, defaultSpeed: 1.5 }, // 2->3: +3.52k (3.2*1.1)
      { level: 4, defaultPower: 88038, defaultSpeed: 1.5 }, // 81.4k (고정, 주어짐)
      { level: 5, defaultPower: 91866, defaultSpeed: 1.5 }, // +3.2k
      { level: 6, defaultPower: 95694, defaultSpeed: 1.5 }, // 88.5k (고정, 주어짐)
      { level: 7, defaultPower: 99522, defaultSpeed: 1.5 }, // 91.7k (고정, 주어짐)
      { level: 8, defaultPower: 103350, defaultSpeed: 1.5 }, // 95.6k (고정, 주어짐)
      { level: 9, defaultPower: 107178, defaultSpeed: 1.65 },
      { level: 10, defaultPower: 111006, defaultSpeed: 1.65 }, // +3.2k
      { level: 11, defaultPower: 114834, defaultSpeed: 1.65 }, // +3.2k
      { level: 12, defaultPower: 118662, defaultSpeed: 1.65 }, // +3.2k
      { level: 13, defaultPower: 122490, defaultSpeed: 1.65 }, // +3.2k
      { level: 14, defaultPower: 126318, defaultSpeed: 1.65 }, // +3.2k
      { level: 15, defaultPower: 130528, defaultSpeed: 1.8 }, // +3.2k
    ],
    levelEffect: [
      {
        level: 3,
        desc: "공격력 +10% 증가합니다",
      },
      {
        level: 6,
        desc: "[연쇄 번개] 스킬의 확률이 +5% 증가합니다",
      },
      {
        level: 9,
        desc: "공격속도가 +10% 증가합니다",
      },
      {
        level: 12,
        desc: "[사신 승천] 확률이 +15% 증가합니다",
      },
      {
        level: 15,
        desc: "공격력과 공격속도가 +10% 증가합니다",
      },
    ],
  },
};
