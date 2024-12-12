export const sendMail = async (
  senderEmail: string, // 送信者のメール (サービスアカウントのメール)
  recipientEmail: string,
  subject: string,
  content: string,
) => {
  const clientId = process.env.AUTH_MICROSOFT_ENTRA_ID_ID
  const clientSecret = process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET
  const tenantId = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT

  if (!clientId || !clientSecret || !tenantId) {
    throw new Error("環境変数が不足しています。")
  }

  try {
    // 1. アクセストークンの取得 (アプリの資格情報を使う)
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
          scope: "https://graph.microsoft.com/.default", // スコープは .default だけ
        }),
      },
    )

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error("トークン取得エラー:", tokenResponse.status, errorData)
      throw new Error(
        `アクセストークンの取得に失敗しました。ステータス: ${tokenResponse.status}`,
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // 2. メールの送信 (client_credentials フローでは /me/sendMail ではなく /users/{senderEmail}/sendMail)
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${senderEmail}/sendMail`, // /me/sendMail から変更
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject,
            body: {
              contentType: "Text",
              content,
            },
            toRecipients: [
              {
                emailAddress: {
                  address: recipientEmail,
                },
              },
            ],
          },
          saveToSentItems: true, // boolean に変更
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("メール送信エラー:", response.status, errorData)
      throw new Error(
        `メール送信に失敗しました。ステータス: ${response.status}`,
      )
    }

    console.log("メール送信成功")
  } catch (error) {
    console.error("メール送信中にエラーが発生しました:", error)
    throw error
  }
}
