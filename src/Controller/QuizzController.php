<?php
namespace App\Controller;

use Symfony\Component\HttpFoundation\Response,
    Symfony\Component\Routing\Annotation\Route;


/**
 * Class QuizzController
 *
 * @Route("/quizz")
 *
 * @package App\Controller
 */

class QuizzController
{
    /**
     * List of quizz
     * @Route("/", name="cq_quizz_get_all", methods={"GET"})
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */

    public function cq_quizz_get_all(): Response
    {
        $number = random_int(0, 100);

        return new Response(
            $number
        );
    }
}
