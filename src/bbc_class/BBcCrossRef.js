export class BBcCrossRef{
  constructor(domain_id, transaction_id) {
    this.domain_id = domain_id; // byte
    this.transaction_id = transaction_id; //byte
  }

  show_cross_rf() {
    console.log('domain_id :', this.domain_id.toString('hex'));
    console.log('transaction_id :',this.transaction_id.toString('hex'));
  }

  set_domain_id(domain_id) {
    this.domain_id = domain_id;
  }

  set_transaction_id(transaction_id) {
    this.transaction_id = transaction_id;
  }

  serialize() {
    return {
      'domain_id': this.domain_id,
      'transaction_id': this.transaction_id
    };
  }

  deserialize(data) {
    this.domain_id = data['domain_id'];
    this.transaction_id = data['transaction_id'];
  }

}