import { Request, Response } from "express";
import { getCustomRepository, IsNull } from "typeorm";
import AppError from "../error/AppError";
import { SurveysUsersRepostory } from "../repositories/SurveysUsersRepostory";
import { resolve } from "path";
import UsersRepository from "../repositories/UsersRepository";
import SurveysRepository from "../repositories/SurveysRepository";
import SendMailService from "../services/SendMailService";

class ResendMailController {
  async execute(request: Request, response: Response) {
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepostory);
    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const { survey_id } = request.params;
    const notAnswered = await surveysUsersRepository.find({
      value: IsNull(),
      survey_id,
    });

    if (!notAnswered.length) {
      return response.json("Not has a survey not answered");
    }

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsmail.hbs");

    const survey = await surveysRepository.findOne({
      id: notAnswered[0].survey_id,
    });

    notAnswered.forEach(async (surveyUser) => {
      const user = await usersRepository.findOne({
        id: surveyUser.user_id,
      });

      const variables = {
        name: user.name,
        title: survey.title,
        description: survey.description,
        id: surveyUser.id,
        link: process.env.URL_MAIL,
      };

      await SendMailService.execute(
        user.email,
        survey.title,
        variables,
        npsPath
      );
    });

    return response.json(notAnswered);
  }
}

export { ResendMailController };
