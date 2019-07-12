const AssistantV2 = require('ibm-watson/assistant/v2');

exports.create = function () {
    const service = new AssistantV2({
        iam_apikey: '96ai9WpNYbay4qqEWEwt-OHpU4XvepsOObthAqADF8DZ',
        version: '2019-02-28',
    });
    return {
        newSession: async function () {
            const assistantId = 'a157c048-38e3-4323-a2c6-69ffedc6db85';

            const res = await service.createSession({
                assistant_id: assistantId,
            });

            const sessionId = res.session_id;

            const session = {
                id: sessionId,
                sendMessage: async function (messageInput) {
                    const response = await service.message({
                        assistant_id: assistantId,
                        session_id: sessionId,
                        input: {
                            message_type: 'text',
                            text: messageInput
                        }
                    });

                    if (response.output.generic) {
                        if (response.output.generic.length > 0) {
                            if (response.output.generic[0].response_type === 'text') {
                                return response.output.generic[0].text;
                            }
                        }
                    }
                },
                endSession: function () {
                    service
                        .deleteSession({
                            assistant_id: assistantId,
                            session_id: sessionId,
                        })
                        .catch(err => {
                            console.log(err);
                        });
                },
                beginConversation: async function () {
                    const response = await service.message({
                        assistant_id: assistantId,
                        session_id: sessionId,
                        input: {
                            message_type: 'text',
                            text: '' // start conversation with empty message
                        }
                    });

                    if (response.output.generic) {
                        if (response.output.generic.length > 0) {
                            if (response.output.generic[0].response_type === 'text') {
                                return response.output.generic[0].text;
                            }
                        }
                    }
                }
            }
            return session;
        }
    };
}