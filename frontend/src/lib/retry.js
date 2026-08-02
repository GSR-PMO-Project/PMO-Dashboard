export async function withRetry(fn, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Attempt ${attempt} failed`, error);
      if (attempt === retries) throw error;
    }
  }
}