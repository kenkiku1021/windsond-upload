import { MainPage } from './main-page';
import './style.scss';
import m from "mithril";
import i18next from 'i18next';
import { i18nResources } from "./resources";

window.app.getLocale().then(locale => {
  i18next.init({
    lng: locale,
    fallbackLng: "en",
    debug: true,
    resources: i18nResources,
  }).then(() => {
    const root = document.getElementById("root");
    m.route(root, "/main", {
      "/main": MainPage,
    });
  });
})
