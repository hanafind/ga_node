// FAQ 정보
let selectFaqList = 
`select * from cs.faq`;

let selectConsultHistorySeq = 
`SELECT last_value as seq FROM cs.consult_history_idx_seq`;

let insertConsultHistory = 
`insert into cs.consult_history(cust_name, created_at) values($1, now())`;

exports.selectFaqList = selectFaqList;
exports.selectConsultHistorySeq= selectConsultHistorySeq;
exports.insertConsultHistory= insertConsultHistory;

