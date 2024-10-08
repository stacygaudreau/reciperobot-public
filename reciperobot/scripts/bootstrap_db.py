##################################################################################
#
#   Recipe Robot database bootstrapping script
#
#   Purpose:
#      - clears/resets and initializes a fresh db for Recipe Robot
#          - creates a number of default entries in the db for deployment, eg:
#          - default Measures, MeasureAliases
#          - some sample Recipes for a demo user
#          - demo account
#      - also resets the current database, applies migrations etc.
#
##################################################################################

import os
import subprocess
import sys
import django
import json
import secrets
from pathlib import Path
from django.core.management import call_command
from environs import Env


DATA_DIR = f"{Path(__file__).resolve().parent}/data"
print(DATA_DIR)


# initialise django with settings module
BASE_DIR = Path(__file__).resolve().parent.parent
print(BASE_DIR)
sys.path.append(str(BASE_DIR))
env = Env()
env.read_env(str(BASE_DIR / ".env"))

django_settings_module = env("DJANGO_SETTINGS_MODULE", default="config.settings.local")
print(django_settings_module)
django.setup()


# import models we're bootstrapping db with
from reciperobot.recipes.models import Recipe, RecipeStep, RecipeIngredient
from reciperobot.ingredients.models import Ingredient
from reciperobot.measures.models import Measure, MeasureAlias
from reciperobot.users.models import User


def create_recipe_owner_user() -> User:
    """
    Create a database user that owns the recipes and other objects imported
    to the database.
    """
    DEFAULT_UNAME = "recipe_robot"
    # prompt user for desired username
    print("\nCreating imported recipe owner user...")
    # username
    username = input("Enter a username for the recipe owner account (blank for default): ")
    username = username if username != "" else DEFAULT_UNAME
    # email
    email = input("Email address (blank for default): ")
    email = email if email != "" else "robot@reciperobot.net"
    # pw
    password = input("Password: ")
    if password == "":
        # generate a random hex passkey
        password = secrets.token_hex(32)
        print(f"Generated random passkey for user {username}: {password}")
        print("Save the autogenerated passkey in a safe place!")
    # name set only if default
    name = "Recipe Robot" if username == DEFAULT_UNAME else ""
    # create the recipe owner user in the db
    user = User.objects.create_user(username=username, email=email, 
                                    password=password, name=name)
    user.save()
    print(f"User created with username: {user.username}, email: {user.email}")
    return user


def is_django_server_running():
    """
    Check if the django server is running on the system
    """
    res = subprocess.run(["pgrep", "-f", "manage.py runserver"],
                         stdout=subprocess.PIPE, text=True)
    return res.stdout.strip() != ""  # running if stdout isn't empty


def kill_django_server():
    """
    Kill the django server process on the system.
    """
    print("Killing running Django server...")
    try:
        subprocess.run(["pkill", "-f", "manage.py runserver"], check=True)
        print("Django runserver has been successfully terminated.")
    except Exception as e:
        print(f"Error while killing Django server: {e}")


def wipe_database():
    """
    Wipe the existing database, migrate and create a superuser
    if the demo superuser .env vars are set.
    """
    os.environ['DJANGO_SUPERUSER_PASSWORD'] = '12345'
    os.environ['DJANGO_SUPERUSER_USERNAME'] = 'admin'
    os.environ['DJANGO_SUPERUSER_EMAIL'] = 'admin@admin.com'
    print("\nWipe existing database...")
    call_command("reset_db", "--noinput")
    print("Apply migrations to fresh database...")
    call_command("migrate", "--noinput")
    # print("Creating superuser with credentials found in .env")
    # call_command("createsuperuser", "--noinput")


def load_measures_into_db(fname: str):
    """
    Measure and MeasureAlias objects are loaded into the database from their
    json data files.
    """
    print("Loading Measures and MeasureAliases...")
    measures = []
    aliases = []
    with open(f"{DATA_DIR}/{fname}") as file:  # noqa: PTH123
        data = json.load(file)
        for measure in data:
            # create a Measure object
            measures.append(Measure.objects.create(
                name=measure["name"], unit_type=measure["unit_type"]))
            # iterate through each of its aliases & create them
            rel_measure = measures[-1]
            for alias in measure["aliases"]:
                aliases.append(MeasureAlias.objects.create(
                    name=alias, measure=rel_measure))
        print(f"Parsed {len(measures)} Measure and {len(aliases)} MeasureAlias objects!")


def load_recipe_ingredient(recipe: Recipe, recipe_ingredient: dict):
    """
    Loads a RecipeIngredient dict into the db for the given
    existing Recipe object. Creates the Ingredient if necessary.
    """
    ingredient = Ingredient.objects.get_or_create(name=recipe_ingredient["ingredient"],
                                                  user=recipe.user)[0]
    print(recipe_ingredient["measure"])
    RecipeIngredient.objects.create(recipe=recipe, ingredient=ingredient,
                                    measure=Measure.objects.get(name=recipe_ingredient["measure"]),
                                    qty_float=recipe_ingredient["qty_float"],
                                    qty_numerator=recipe_ingredient["qty_numerator"],
                                    qty_denominator=recipe_ingredient["qty_denominator"],
                                    modifier=recipe_ingredient["modifier"],
                                    order=recipe_ingredient["order"])


def load_recipe_step(recipe: Recipe, step: dict):
    """
    Loads a single RecipeStep from a given dict.
    """
    RecipeStep.objects.create(recipe=recipe, text=step["text"],
                              order=step["order"])


def load_recipes(fname: str):
    """
    Parses json data of recipes, creating Recipe, Ingredient,
    RecipeIngredient and RecipeStep objects in the database
    in the process.
    """
    print("Loading Recipes...")
    user = create_recipe_owner_user()
    recipes = []
    with open(f"{DATA_DIR}/{fname}") as file:  # noqa: PTH123
        data = json.load(file)
        for recipe in data:
            # create a Recipe object
            recipes.append(Recipe.objects.create(
                name=recipe["name"], description=recipe["description"],
                version=recipe["version"], is_public=recipe["is_public"],
                user=user))
            # load each ingredient
            for ingredient in recipe["ingredients"]:
                load_recipe_ingredient(recipes[-1], ingredient)
            # load each step
            for step in recipe["steps"]:
                load_recipe_step(recipes[-1], step)

            # rel_measure = measures[-1]
            # for alias in measure["aliases"]:
                # aliases.append(MeasureAlias.objects.create(
                    # name=alias, measure=rel_measure, user=user,))
        print(f"Parsed {len(recipes)} Recipe objects!")


print("\n//// RECIPE ROBOT DATABASE BOOTSTRAPPING ////")
# kill the django server process if it's already running
if is_django_server_running():
    kill_django_server()
# wipe and migrate existing database
wipe_database()
# load model objects from json files
load_measures_into_db("measures.json")
load_recipes("recipes.json")





