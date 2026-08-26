import { Button } from "@/shared/components/Button/Button";
import styles from "./EmptyState.module.css";

export function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <section className={styles.empty}>
      <div>✓</div>
      <h2>No tasks yet</h2>
      <p>Adjust the filters or create a new task to get started.</p>
      <Button onClick={onCreate}>Create task</Button>
    </section>
  );
}
