import { useState } from "react";
import type { Save } from "./engine";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Cloud,
  Compass,
  Shield,
  Sparkles,
} from "lucide-react";
export function Pathfinder({
  save,
  onAwaken,
}: {
  save: Save;
  onAwaken: (name: string, experience: string) => void;
}) {
  const [step, setStep] = useState(0),
    [name, setName] = useState(save.name === "Hunter" ? "" : save.name),
    [experience, setExperience] = useState(save.experience);
  const experiences = [
    "New to the cloud",
    "Some hands-on experience",
    "Preparing for certification",
  ];
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span /> CAREER PATHFINDER
          </div>
          <h1>Your next chapter starts with you.</h1>
          <p>
            Choose a direction. Awaken a class. Build skills that travel beyond
            the game.
          </p>
        </div>
      </div>
      <section className="panel pathfinder">
        <div className="path-steps" aria-label="Pathfinder progress">
          {[
            "Choose your path",
            "Set your starting point",
            "Awaken your class",
          ].map((label, index) => (
            <span
              key={label}
              className={
                index === step ? "current" : index < step ? "complete" : ""
              }
            >
              <b>{index < step ? <Check size={13} /> : index + 1}</b>
              {label}
            </span>
          ))}
        </div>
        {step === 0 ? (
          <>
            <div className="path-emblem">
              <Cloud size={42} />
            </div>
            <div className="eyebrow">FIRST CAREER CAMPAIGN</div>
            <h2>Road to Cloud Sovereign</h2>
            <p>
              Learn the foundations of cloud identity and security in the
              Citadel of Identity. You begin as a Cloud Initiate and earn your
              place as a Cloud Warden through learning and practice.
            </p>
            <div className="path-choice">
              <Shield size={27} />
              <div>
                <strong>Cloud Warden</strong>
                <span>Identity · Permissions · Security · Auditing</span>
              </div>
              <span className="tag teal-tag">PLAYABLE NOW</span>
            </div>
            <p className="muted">
              Other career classes and later cloud chapters are planned. This
              release is solo-first, untimed, and focused on IAM.
            </p>
            <button className="primary" onClick={() => setStep(1)}>
              Choose the cloud path <ArrowRight size={16} />
            </button>
          </>
        ) : step === 1 ? (
          <>
            <div className="eyebrow">A PERSONAL STARTING POINT</div>
            <h2>Meet your inner Hunter.</h2>
            <label className="path-label">
              Hunter name{" "}
              <input
                autoFocus
                maxLength={24}
                value={name}
                placeholder="Choose a name"
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <fieldset>
              <legend>How familiar are you with cloud computing?</legend>
              {experiences.map((value) => (
                <label
                  className={
                    "experience-option " +
                    (value === experience ? "selected" : "")
                  }
                  key={value}
                >
                  <input
                    type="radio"
                    name="experience"
                    checked={experience === value}
                    onChange={() => setExperience(value)}
                  />
                  {value}
                </label>
              ))}
            </fieldset>
            <p className="muted">
              This personalizes your starting guidance. Every lesson and core
              battle command stays available, and you can change these details
              later.
            </p>
            <div className="button-row">
              <button className="secondary" onClick={() => setStep(0)}>
                <ArrowLeft size={15} /> Back
              </button>
              <button className="primary" onClick={() => setStep(2)}>
                Reveal your path <Sparkles size={15} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="path-emblem">
              <Compass size={42} />
            </div>
            <div className="eyebrow">YOUR CLASS · CLOUD INITIATE</div>
            <h2>{name.trim() || "Hunter"}, your potential is awakening.</h2>
            <p>
              {experience === "New to the cloud"
                ? "Start with the short identity lesson, then learn how permissions and auditing protect a cloud environment."
                : experience === "Some hands-on experience"
                  ? "Connect your practical experience to IAM concepts, then use the trial and the Warden to find gaps worth reviewing."
                  : "Use the lessons and practice journal to review IAM. This chapter is introductory and covers only part of a certification syllabus."}
            </p>
            <div className="path-guidance">
              <article>
                <h3>Skills & projects</h3>
                <p>
                  Learn users, groups, roles, policy scope, least privilege,
                  MFA, and audit events. Draft a least-privilege policy for a
                  fictional report reader and draw an access-flow diagram. No
                  cloud account or spending is required for this game.
                </p>
              </article>
              <article>
                <h3>A possible certification path</h3>
                <p>
                  AWS Certified Cloud Practitioner covers foundational cloud
                  understanding. Solutions Architect – Associate can be a later
                  architecture-focused goal after broader study and hands-on
                  experience. This is an optional sequence, not a required dual
                  certification.
                </p>
                <a
                  href="https://aws.amazon.com/certification/certified-cloud-practitioner/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Official foundational certification guide ↗
                </a>
                <a
                  href="https://aws.amazon.com/certification/certified-solutions-architect-associate/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Official architecture certification guide ↗
                </a>
              </article>
            </div>
            <p className="path-disclaimer">
              Fictional ranks do not grant real certifications. No employment
              outcome or AWS endorsement is promised. Existing XP, lessons,
              equipment, and rewards are preserved.
            </p>
            <div className="button-row">
              <button className="secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={15} /> Back
              </button>
              <button
                className="primary"
                onClick={() => onAwaken(name.trim() || "Hunter", experience)}
              >
                Awaken & enter the Nexus <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
