import { MainPage } from './main-page';
import './style.scss';
import m from "mithril";
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { i18nResources } from "./resources";

i18next.use(LanguageDetector).init({
  fallbackLng: "en",
  debug: true,
  resources: i18nResources,
}).then(() => {
  const root = document.getElementById("root");
  m.route(root, "/main", {
    "/main": MainPage,
  });
});
