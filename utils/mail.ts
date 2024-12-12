export const sendMail = async (
  senderEmail: string,
  recipientEmail: string,
  subject: string,
  content: string,
) => {
  const clientId = process.env.AUTH_MICROSOFT_ENTRA_ID_ID
  const clientSecret = process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET
  const tenantId = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT

  if (!clientId || !clientSecret || !tenantId) {
    console.error("環境変数が設定されていません。")
    throw new Error("環境変数が不足しています。")
  }

  try {
    // 1. アクセストークンの取得
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
          scope: "https://graph.microsoft.com/.default",
        }),
      },
    )

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text() // JSONが返らないかもしれないので text() にする
      console.error("トークン取得エラー:", tokenResponse.status, errorData)
      throw new Error(
        `アクセストークンの取得に失敗しました。ステータス: ${tokenResponse.status}`,
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    if (!accessToken) {
      console.error("トークンの中身が不正です:", tokenData)
      throw new Error("アクセストークンの取得に失敗しました。")
    }

    // 2. メールの送信
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${senderEmail}/sendMail`,
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
            toRecipients: [{ emailAddress: { address: recipientEmail } }],
          },
          saveToSentItems: "true",
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.text() // JSONが返らない可能性があるので text() にする
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
