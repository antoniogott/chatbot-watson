const AssistantV2 = require('ibm-watson/assistant/v2');

exports.create = function () {
    const service = new AssistantV2({
        iam_apikey: '96ai9WpNYbay4qqEWEwt-OHpU4XvepsOObthAqADF8DZ',
        version: '2019-02-28',
    });
    return {
        newSession: async () => { return await newSession(service); }
    };
}

async function newSession(service) {
    const assistantId = 'a157c048-38e3-4323-a2c6-69ffedc6db85';

    const res = await service.createSession({
        assistant_id: assistantId,
    });

    const sessionId = res.session_id;

    const session = {
        id: sessionId,
        begin: async () => { return await sendMessage(service, assistantId, sessionId, ''); },
        send: async (msg, context) => { return await sendMessage(service, assistantId, sessionId, msg, context); },
        end: () => { endSession(service, assistantId, sessionId); }
    }
    return session;
}

async function sendMessage(service, assistantId, sessionId, messageInput, context) {
    const payload = {
        assistant_id: assistantId,
        session_id: sessionId,
        input: {
            message_type: 'text',
            text: messageInput,
            options: {
                return_context: true
            }
        }
    }
    if (context) payload.context = context;
    const response = await service.message(payload);

    if (response.output.generic) {
        if (response.output.generic.length > 0) {
            if (response.output.generic[0].response_type === 'text') {
                return {
                    text: response.output.generic[0].text,
                    context: response.context.skills['main skill'].user_defined
                };
            }
        }
    }
}

function endSession(service, assistantId, sessionId) {
    service
        .deleteSession({
            assistant_id: assistantId,
            session_id: sessionId,
        })
        .catch(err => {
            console.log(err);
        });
}