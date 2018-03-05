import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PortfolioDetailsPage } from "../portfolio-details/portfolio-details";
import { TransferPage } from "../transfer/transfer";
import { AccountProvider } from "../../providers/account";
import { Account } from "../../model/account";
import { CurrencyProvider } from "../../providers/currency";
import { FormatProvider } from "../../providers/format";
import { LoaderProvider } from '../../providers/loader';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html'
})
export class PortfolioPage {
  public error: string;
  private activeAccount: Account;
  private portfolioSubscription: Subscription;

  constructor(private navCtrl: NavController, private currencyProvider: CurrencyProvider,
    public accountProvider: AccountProvider, public formatProvider: FormatProvider,
    private loaderProvider: LoaderProvider) {
  }

  activeAccountCanSend(token) {
    return this.accountProvider.accountCanSend(this.activeAccount, token.network, token.currency);
  }

  activeAccountBalance(token) {
    return this.formatProvider.formatAmount(token.balance) + ' ' + token.currency;
  }

  startTransfer(token, event: FocusEvent) {
    event.stopPropagation();
    this.navCtrl.parent.parent.push(TransferPage, { token: token });
  }

  goToDetailsPage(token) {
    this.navCtrl.push(PortfolioDetailsPage, { token: token });
  }

  getCore() {
    return this.activeAccount.portfolio.filter(item => (item.network == null))
  }

  getTokens(network) {
    return this.activeAccount.portfolio.filter(item => (item.network == network))
  }

  doRefresh(refresher) {
    if (this.activeAccount) {
      this.loaderProvider.startWeb3();
      this.portfolioSubscription = this.currencyProvider.portfolioObs(this.activeAccount)
        .first().subscribe(data => {
          if (data.length > 0) {
            this.loaderProvider.setStatus('PortfolioLoaded');
            this.loaderProvider.endStart();
            this.activeAccount.portfolio = data;
          }
          if(refresher) {
            refresher.complete();
          }
        });
    }
  }

  ionViewWillEnter() {
    this.activeAccount = this.accountProvider.getActiveAccount();
    this.loaderProvider.setStatus('PortfolioStart');
    if (!this.activeAccount) {
      this.navCtrl.parent.select(1);
      return;
    }
  }

  ionViewDidEnter() {
    this.doRefresh(null);
  }

  ionViewWillLeave() {
    if (this.portfolioSubscription) {
      this.portfolioSubscription.unsubscribe();
    }
  }
}