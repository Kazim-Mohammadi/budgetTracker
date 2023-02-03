import jsonFile from "jsonfile";
import moment from "moment";
import random from "random";
import simpleGit from "simple-git";

const FILE_PATH = "./public/data.json";
const git = simpleGit();

const makeCommit = (n) => {
  if (n === 0) {
    return git.push();
  }

  const x = random.int(0, 54);
  const y = random.int(0, 6);

  const DATE = moment()
    .subtract(2, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format();

  const data = { date: DATE };

  jsonFile.writeFile(FILE_PATH, data, (error) => {
    if (error) {
      console.error(error);
    } else {
      git.add([FILE_PATH]).commit(DATE, { "--date": DATE }, (error) => {
        if (error) {
          console.error(error);
        } else {
          makeCommit(n - 1);
        }
      });
    }
  });
};

makeCommit(400);
