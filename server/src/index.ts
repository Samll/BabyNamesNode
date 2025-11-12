import app from './app';
import { initializeRepositories } from './repositories';

const PORT = process.env.PORT ?? 3000;

void initializeRepositories()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize repositories', error);
    process.exit(1);
  });
