import sequelize from '../configDB/db';
import { User } from '../models/User.model';
import { Skill } from '../models/Skill.model';
import { SkillsCategory } from '../models/SkillsCategory.model';
import { Session } from '../models/Session.model';
import { UserSkill } from '../models/UserSkill.model';
import { UserSkillCategory } from '../models/UserSkillCategory.model';
import { Reputation } from '../models/Reputation.model';
import { Availability } from '../models/Availability.model';
import { ChatMessage } from '../models/Chat.model';
import { Report } from '../models/Report.model';
import { Exchange } from '../models/Exchange.model';

async function seed() {
    await sequelize.sync({ force: true }); // Reset la BDD

    // Catégories
    const devCat = await SkillsCategory.create({
        name: 'Développement',
        description: 'Programmation, web, etc.'
    });
    const designCat = await SkillsCategory.create({
        name: 'Design',
        description: 'Graphisme, UI/UX'
    });

    // Création des catégories
    const categoriesList = [
        'Mathématiques',
        'Programmation',
        'Langues étrangères',
        'Sciences physiques',
        'Histoire-Géographie',
        'Littérature',
        'Arts plastiques',
        'Musique',
        'Économie',
        'Philosophie',
        'Biologie',
        'Chimie',
        'Informatique',
        'Marketing',
        'Comptabilité',
        'Droit',
        'Psychologie',
        'Architecture',
        'Design graphique',
        'Photographie'
    ];

    const categories: { [key: string]: SkillsCategory } = {};
    for (const name of categoriesList) {
        categories[name] = await SkillsCategory.create({ name });
    }

    // Skills
    const jsSkill = await Skill.create({
        name: 'JavaScript',
        idCategory: categories['Programmation'].id,
        description: 'Langage JS'
    });
    const nodeSkill = await Skill.create({
        name: 'Node.js',
        idCategory: categories['Programmation'].id,
        description: 'Backend JS'
    });
    const photoshopSkill = await Skill.create({
        name: 'Photoshop',
        idCategory: categories['Design graphique'].id,
        description: 'Logiciel de graphisme'
    });

    // Users
    const alice = await User.create({
        firstname: 'Alice',
        lastname: 'Dev',
        email: 'alice@dev.com',
        password: 'hashed',
        sexe: 'F',
        birthdate: new Date('1995-01-01'),
        role: 'helper',
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    const bob = await User.create({
        firstname: 'Bob',
        lastname: 'Graph',
        email: 'bob@graph.com',
        password: 'hashed',
        sexe: 'M',
        birthdate: new Date('1998-05-10'),
        role: 'student',
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    // UserSkill (liaison N-N)
    await UserSkill.create({ userId: alice.id, skillId: jsSkill.id });
    await UserSkill.create({ userId: alice.id, skillId: nodeSkill.id });
    await UserSkill.create({ userId: bob.id, skillId: photoshopSkill.id });

    // UserSkillCategory (liaison N-N)
    await UserSkillCategory.create({ userId: bob.id, skillCategoryId: devCat.id });
    await UserSkillCategory.create({ userId: alice.id, skillCategoryId: designCat.id });

    // Reputation
    await Reputation.create({ idUser: alice.id, score: 4.8 });
    await Reputation.create({ idUser: bob.id, score: 3.5 });

    // Disponibilités
    await Availability.create({
        idUser: alice.id,
        day: new Date(),
        startTime: '09:00',
        endTime: '12:00'
    });

    // Sessions
    const session1 = await Session.create({
        name: 'Session JS débutant',
        meetUrl: 'https://meet.example.com/1',
        idHelper: alice.id,
        idStudent: bob.id,
        day: new Date(),
        startTime: '09:00',
        endTime: '10:00',
        status: 'confirmed',
        requestedBy: bob.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    // Chat
    await ChatMessage.create({
        idSession: session1.id,
        idSender: bob.id,
        idReceiver: alice.id,
        content: 'Bonjour, merci pour la session !',
        isAnonymized: false,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    // Report
    await Report.create({
        reporterId: bob.id,
        reportedUserId: alice.id,
        reportedSessionId: session1.id,
        reason: 'Très bon échange',
        status: 'fermé',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    // Exchange
    await Exchange.create({
        userId: alice.id,
        withUserId: bob.id,
        duration: 60,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    console.log('Seed terminé !');
    process.exit(0);
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
