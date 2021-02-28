import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepostory } from "../repositories/SurveysUsersRepostory";

class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;
    console.log(survey_id);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepostory);

    const surveyUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    console.log(surveyUsers);

    const destractor = surveyUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;

    const promoters = surveyUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const passive = surveyUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;

    const totalAnswers = surveyUsers.length;

    const calculate = Number(
      (((promoters - destractor) / totalAnswers) * 100).toFixed(2)
    );

    return response.json({
      destractor,
      promoters,
      passive,
      nps: calculate,
      totalAnswers,
    });
  }
}

export { NpsController };
