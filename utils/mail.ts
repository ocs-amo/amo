export const sendMail = async (
  accessToken: string, // 送信者のメール (サービスアカウントのメール)
  recipientEmail: string,
  subject: string,
  content: string,
) => {
  try {
    const response = await fetch(
      "https://graph.microsoft.com/v1.0/me/sendMail",
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
