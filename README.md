# CortexQuizz

# Application de creation de quizz pour Cortez Digital.
# Git https://github.com/JeremyCoutellec/CortexQuizz

# Entity 
Theme
Id, name(string), type(enum) ? 

Quizz
Id, name(string), theme(Theme), online(boolean), questions(Question[]), difficulty(Difficulty)

Question
Id, title(string), answer(string), proposition(Proposition[]), explication(string)

Difficulty
Id, name(string), sequence(int)

Proposition
Id, name(string), answer(boolean)

User
Id, firstName(string), lastName(string), email(string), groups(Group[])

Group
fosGroup

# App mobile ? 
# Test symfony + react Formation ? 
