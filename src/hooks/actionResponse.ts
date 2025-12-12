export async function actionResponse<T>(fn: () => Promise<T>) {
  try {
    const data = await fn()
    return { 
      success: true,
      data: JSON.parse(JSON.stringify(data)), // <— MAKE 100% SERIALIZABLE
    }
  } catch (err: any) {

    return {
      success: false,
      error: err?.message ?? "Unexpected error",
    }
  }
}
