
export const attachmentResponse = (attachment) => {
   const attachmentRes = {
       _id: attachment._id,
       originalName: attachment.originalName,
       mimetype: attachment.mimetype,
       size: attachment.size
   }

   return attachmentRes;
}


export const attachmentsResponse = (attachments) =>{
    return attachments.map(attachment => attachmentResponse(attachment));

}



