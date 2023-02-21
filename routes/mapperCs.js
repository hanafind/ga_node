// FAQ 정보
let selectFaqList = 
`select * from cs.faq`;

let selectConsultantSeq = 
`SELECT last_value as seq FROM cs.consultant_idx_seq`;

let insertConsultant = 
`insert into cs.consultant(cust_name, created_at) values($1, now())`;

exports.selectFaqList = selectFaqList;
exports.selectConsultantSeq= selectConsultantSeq;
exports.insertConsultant= insertConsultant;

