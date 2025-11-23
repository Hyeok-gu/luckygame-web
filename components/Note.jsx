import styles from "@/styles/BattlePanel.module.css";
export default function Note(props) {
  const { onClose } = props;
  return (
    <div className={styles.noteModal}>
      <div className={styles.noteInner}>
        <button onClick={onClose} className={styles.noteCloseButton}>
          닫기
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="40px"
            viewBox="0 -960 960 960"
            width="40px"
            fill="#444444"
          >
            <path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z" />
          </svg>
        </button>
        <p className={styles.title}>개발자 노트</p>
        <p className={styles.desc}>
          안녕하세요.
          <br />
          <br />
          해당 서비스는 실제 플레이를 하면서 직접 실험하고, 여러 유저분들이
          정리해주신 공식과 데이터를 바탕으로 조금씩 쌓아올린 참고용
          서비스입니다. 게임 속 공격력은 영웅마다의 특성, 유물 레벨, 골드량 등
          다양한 요소가 서로 얽혀 있어 한 판 한 판 직접 비교해보려면 시간이 꽤나
          걸리고, 실제 플레이 상황에서는 동일한 조건을 맞춰 테스트하기도 쉽지
          않아 이런 점이 늘 아쉬웠습니다.
          <br />
          <br />
          “그럼 차라리 비교해볼 수 있는 도구라도 만들어보자”는 마음으로 개발을
          시작하게 되었습니다. 이 서비스는 그런 작은 불편함을 해소하고, 여러
          영웅이나 조합이 어떤 느낌인지 대략적인 경향을 보기 위한 용도로
          만들어졌습니다.
          <br />
          <br />
          다만, 어디까지나 제가 게임 내부 공식 전체를 알고 있는 것은 아니기
          때문에, 수많은 실험과 커뮤니티 분들의 정보들을 통해 최대한 현실적인
          수치에 가깝게 구성했지만, 정확한 공식이나 절대적인 기준은 절대로
          아닙니다.
          <br />
          <br />
          앞으로 더 분석력 뛰어난 분들이 이 서비스에 관심을 가져주시고 다양한
          의견을 주실 수 있다는 것도 잘 알고 있습니다. 그런 부분은 언제든 감사히
          참고하겠지만, 너무 전문적인 기준으로 바라보기보다는 참고용‧재미용으로
          가볍게 활용해주시면 큰 힘이 될 것 같습니다. 개발자도 사람인지라…
          상처받을까 조금 무서워서 드리는 부탁입니다. 😅 부족한 부분이 있다면
          천천히 개선해 나가겠습니다. 사용해 주셔서 감사합니다!
        </p>
        <ul className={styles.list}>
          <li className={styles.listTitle}>신화영웅</li>
          <li className={styles.item}>
            - 신화 레벨을 선택할 수 있도록 개발했습니다.
          </li>
          <li className={styles.item}>
            - 선택한 레벨에 따라 적용되는 공격력%와 공격속도%를 적용했습니다.
          </li>
          <li className={styles.item}>
            - 선택한 레벨에 따라 적용되는 스킬 효과 및 스킬 강화 효과를
            적용했습니다.
            <span className={styles.ex}>
              예) 헤일리 12레벨 미만은 빛의 씨앗 스킬을 사용하지 않습니다.
            </span>
            <span className={styles.ex}>
              예) 헤일리 6레벨 이상은 별의 힘 공격력 증가량이 400%입니다.
            </span>
          </li>
          <li className={styles.item}>
            - 테스트 시, 헤일리는 별의 힘 10개를 모은 상태입니다.
          </li>
          <li className={styles.listTitle}>보물과 유물</li>
          <li className={styles.item}>
            - 레벨별 효과가 적용되도록 개발했습니다.
          </li>
          <li className={styles.item}>
            - 현재는 아래와 같은 유물 효과를 개발했습니다.
            <span className={styles.ex}>공격력 증가</span>
            <span className={styles.ex}>피해량 증가</span>
            <span className={styles.ex}>치명타 확률 증가</span>
            <span className={styles.ex}>치명타 피해량 증가</span>
            <span className={styles.ex}>공격속도 증가</span>
            <span className={styles.ex}>스킬 피해량 증가</span>
            <span className={styles.ex}>스킬 발동 확률 증가</span>
            <span className={styles.ex}>머니건의 공격력 증가</span>
            <span className={styles.ex}>마나 반환 증가</span>
            <span className={styles.ex}>
              그외 유물 효과는 신화영웅을 추가하면서 필요 시, 더 추가할
              예정입니다.
            </span>
          </li>
          <li className={styles.item}>
            - 마법피해는 마법사의 모자, 물리피해는 방망이 유물 효과가
            적용됩니다.
          </li>
          <li className={styles.item}>
            - 대검 유물은 보스공격ON 시, 피해량에 적용됩니다.
          </li>
          <li className={styles.listTitle}>
            펫과 영웅 종합 버프... 그리고 블롭 피규어
          </li>
          <li className={styles.item}>
            - 우선적으로 필요한 효과만 구현해놓았습니다. 구현되지 않은 버프는
            회색으로 취소선이 되어 있습니다.
          </li>
          <li className={styles.item}>
            - 구현하지 않은 이유는.. 아직 제 계정의 펫 종합 레벨이 220
            구간이어서 실제로 테스트해보기 전에는 넣지 않는 것으로 했습니다.
          </li>
          <li className={styles.item}>
            - 펫 개별 능력치는 개발 소요도 있어서 후순위로 개발 예정입니다.
          </li>
          <li className={styles.item}>
            - 블롭 피규어는 제가 아직 유물 만렙이 아니어서 구현해낼 수 없기에
            후순위로 개발 예정입니다..
          </li>
          <li className={styles.listTitle}>인게임 요소</li>
          <li className={styles.item}>
            - 최종 공격력 공식은 네이버 카페, 블로그 등을 바탕으로 계산했습니다.
            <span className={styles.ex}>
              최종 공격력 = (1/2*(1+전설~불멸 강화))*((신화 기본 공격력+블롭
              공격력 증가)*(1+힘의 물약*2+베인 최후+(펫개별 공격력 증가+펫종합
              공격력 증가+영웅종합 공격력 증가))+(신화 기본 공격력*호랑이 공격력
              증가))*(1+머니건 효과+모아공+드래곤+배트맨+로카+헤일리)
            </span>
            <span className={styles.ex}>
              💡펫개별 공격력 증가는 현재 개발중입니다.
            </span>
            <span className={styles.ex}>
              💡만약 수식이 잘못 되었을 경우, 구글 폼을 통해 의견과 자료
              남겨주시면 감사드리겠습니다. 서비스 개선에 큰 도움이 됩니다.
            </span>
          </li>
          <li className={styles.item}>
            - 영웅별 마나회복 시간은 아래와 같습니다.
            <span className={styles.ex}>
              💡헤일리의 궁극기 마나회복 시간은 72초로 측정했습니다.
            </span>
            <span className={styles.ex}>
              💡각성 헤일리의 궁극기 마나회복 시간은 90초로 측정했습니다.
            </span>
            <span className={styles.ex}>
              💡사신 다이안의 궁극기 마나회복 시간은 90초로 측정했습니다.
            </span>
            <span className={styles.ex}>
              💡만약 신화의 쿨타임 및 마나회복 시간이 잘못 측정되었다면 구글폼을
              통해 내용과 자료 함께 전달해 주시면 큰 도움이 됩니다 감사합니다.
            </span>
            <span className={styles.ex}>
              💡현자의 요거트는 궁극기의 퍼센트만큼 바로 회복 시키나, 구현하는
              과정에서 회복 시간을 단축시키는 것으로 변경했습니다.
              <br />
              예) 유물효과: 10% 반환 시, 72초에서 7.2초 단축시킨 마나회복시간을
              64.8초로 구현했습니다.
            </span>
          </li>
          <li className={styles.item}>
            - 각성 헤일리의 태양의 힘 내 다른 신화 종류 당 스킬 피해 5% 증가는
            곱연산으로 계산되었습니다.
            <span className={styles.ex}>
              💡테스트 과정에서 곱연산으로 했을 때 피해 데미지가 일치한 것을
              확인했습니다. 만약 잘못 측정되었다면 내용과 자료를 함께 전달해
              주시면 큰 도움이 됩니다. 감사합니다.
            </span>
          </li>
          <li className={styles.item}>
            - 같은 대상 공격 ON 시, 각성 헤일리의 태초의 폭발이 3회 누적마다
            즉시 폭발하게 되도록 구현했습니다.
          </li>
          <li className={styles.item}>
            - 입력한 코인은 똑같은데, 실제 게임과 머니건 효과 퍼센트가 다른
            이유.
            <span className={styles.ex}>
              💡추측으로는 소수점 단위 절삭에 따른 퍼센트 차이로 보입니다.
            </span>
          </li>
          <li className={styles.listTitle}>치명타에 관하여</li>
          <li className={styles.item}>
            - 치명타 확률은 정확히 나온 자료를 찾지 못했으나, 여러 번의 테스트를
            통해 대략 4~6%로 측정했습니다.
            <span className={styles.ex}>
              💡해당 서비스에서는 기본 치명타 확률을 5%로 했습니다.
            </span>
            <span className={styles.ex}>
              💡밤바인형과 펫 종합효과의 치명타 확률은 0.05+밤바유물+펫종합효과
              로 계산했습니다.(5%의 2%는 너무 큰 의미가 없는 효과일 것 같다는
              생각에 더했습니다.)
            </span>
          </li>
          <li className={styles.item}>
            - 기본 치명타 피해는 250%로 확인했습니다.
            <span className={styles.ex}>
              💡만약 잘못된 정보라면 구글 폼을 통해서 내용과 자료를 보내주시면
              큰 도움이 됩니다.
            </span>
          </li>
          <li className={styles.item}>
            - 매직건틀렛 효과는 마법피해에만 치명타 피해가 적용되는 것으로
            확인했습니다.
            <span className={styles.ex}>
              💡만약 잘못된 정보라면 구글 폼을 통해서 내용과 자료를 보내주시면
              큰 도움이 됩니다.
            </span>
          </li>
          <li className={styles.item}>
            - 치명타 피해 계산식은 아래와 같이 계산했습니다.
            <span className={styles.ex}>
              (2.5 + 유물 치명타 피해(마법피해만) + 펫 종합 효과 + 펫 개별
              효과(후순위 개발 중))
            </span>
          </li>
          <li className={styles.item}>
            - 전투측정표 내 1회 피해량은 공격 시 발생하는 피해량입니다.
            <span className={styles.ex}>
              만약 치명타가 발생한 경우, 피해량이 변동되었다가 다음 공격의
              피해량으로 변경됩니다.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
