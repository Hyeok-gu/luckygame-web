import styles from "./styles.module.css";

export default function SectionTitle(props) {
  const { title, description } = props;
  return (
    <div className={styles.sectionTitleWrapper}>
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
