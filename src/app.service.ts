import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import * as moment from 'moment';

@Injectable()
export class AppService {
  createZaloPayPayment() {
    const config = {
      app_id: '2553',
      key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
      key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
      endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
      return_url: 'https://localhost/payments',
      callback_url: 'https://localhost/api/v1/transaction/callback',
    };

    const embed_data = {
      redirecturl: config.return_url,
    };

    const items = [{}];

    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: 'user123',
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: 50000,
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: 'zalopayapp',
      mac: '',
      callback_url: config.callback_url,
    };

    const data =
      config.app_id +
      '|' +
      order.app_trans_id +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time +
      '|' +
      order.embed_data +
      '|' +
      order.item;
    order.mac = this.createSecureHash(data, config.key1);
    console.log(order);

    axios
      .post(config.endpoint, null, { params: order })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }
  createSecureHash(notEncodeData: string, key: string) {
    return crypto.createHmac('sha256', key).update(notEncodeData).digest('hex');
  }
}
