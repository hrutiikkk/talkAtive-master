import moment from "moment";

export const processMessagesWithTimeline = (messages) => {
  const formattedMessages = [];
  let lastDate = null;

  messages.forEach((message) => {
    const messageDate = new Date(message.createdAt).toDateString();

    if (lastDate !== messageDate) {
      formattedMessages.push({
        ...message,
        timelineLabel: moment(message.createdAt).calendar(null, {
          sameDay: '[Today]',
          lastDay: '[Yesterday]',
          lastWeek: 'dddd',
          sameElse: 'MMMM D, YYYY',
        }),
      });
    } else {
      formattedMessages.push(message);
    }

    lastDate = messageDate;
  });

  return formattedMessages;
};
